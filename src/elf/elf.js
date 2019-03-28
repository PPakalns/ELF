import Long from "long"

function padZeros(str, length = 2)
{
    if (str.length >= length)
        return str
    let padding = ""
    for (let needed = 2 - str.length; needed > 0; needed--)
    {
        padding += "0"
    }
    return padding + str
}

class Bytes {
    constructor(size)
    {
        this.size = size;
        this.data = null
    }

    SetData(data)
    {
        this.data = data
    }

    toString()
    {
        let values = []
        for (let val of this.data)
            values.push(padZeros(val.toString(16)))
        return values.join(' ')
    }
}

const DATA_TYPES = {
    UInt64: {size: 8},
    UInt32: {size: 4},
    UInt16: {size: 2},

    Int64: {size: 8},
    Int32: {size: 4},

    Bytes: Bytes,
}

class ByteView {
    constructor(buffer, offset, length)
    {
        this.buffer = buffer
        this.offset = offset
        this.length = length
    }

    checkRange(offset, length)
    {
        if (offset < 0)
            throw new Error("Offset smaller than zero")
        if (offset + length > this.length)
            throw new Error("Offset overshot file end")
    }

    readBytes(offset, length)
    {
        this.checkRange(offset, length)
        let bytes = []
        for (let i = 0; i < length; i++)
        {
            bytes.push(this.buffer[this.offset + offset + i])
        }
        return bytes
    }

    getView(offset, length)
    {
        this.checkRange(offset, length)
        return new ByteView(this.buffer, this.offset + offset, length)
    }

    readUInt64(offset)
    {
        return new Long.fromBytesLE(this.readBytes(offset, 8), true)
    }

    readUInt32(offset)
    {
        return new Long.fromBytesLE(this.readBytes(offset, 4), true)
    }

    readUInt16(offset)
    {
        return new Long.fromBytesLE(this.readBytes(offset, 2), true)
    }

    readInt64(offset)
    {
        return new Long.fromBytesLE(this.readBytes(offset, 8), false)
    }

    readInt32(offset)
    {
        return new Long.fromBytesLE(this.readBytes(offset, 4), false)
    }

    readType(offset, type)
    {
        if (type instanceof DATA_TYPES.Bytes)
        {
            let bytes = type
            bytes.SetData(this.readBytes(offset, type.size))
            return type
        }
        switch (type)
        {
            case DATA_TYPES.UInt64:
                return this.readUInt64(offset)
            case DATA_TYPES.Int64:
                return this.readInt64(offset)
            case DATA_TYPES.UInt32:
                return this.readUInt32(offset)
            case DATA_TYPES.Int32:
                return this.readInt32(offset)
            case DATA_TYPES.UInt16:
                return this.readUInt16(offset)
            default:
                throw Error("Unsupported type " + type)
        }
    }
}

class ByteData
{
    constructor(buffer)
    {
        this.buffer = new Uint8Array(buffer)
    }

    get length(){
        return this.buffer.byteLength
    }

    getView(offset, length)
    {
        if (offset < 0)
            throw new Error("Offset smaller than zero")
        if (offset + length > this.buffer.byteLength)
            throw new Error("Offset overshot file end")
        return new ByteView(this.buffer, offset, length)
    }
}

class DataRepresentation
{
    constructor(description, parentView, offset)
    {
        let calculatedLength = 0
        for (let desc of description)
        {
            calculatedLength += desc.type.size
        }

        this.view = parentView.getView(offset, calculatedLength)
        this.description = description
        this.data = {}
        this.readData()
    }

    readData()
    {
        let offset = 0
        for (let desc of this.description)
        {
            this.data[desc.name] = this.view.readType(offset, desc.type)
            offset += desc.type.size
        }
    }

    getLongData(key)
    {
        // This could return wrong value if the stored number ir larger than 2^53 - 1
        // In normal elf files there are no such offsets or virtual addresses
        return this.data[key].toNumber()
    }

    getRepresentation()
    {
        let repr = []
        for (let desc of this.description)
        {
            let value = this.data[desc.name]
            if (desc.hex)
            {
                value = "0x"+value.toString(16)
            }
            repr.push({name: desc.name, value: value})
        }
        return repr
    }

    get length()
    {
        return this.view.length
    }
}

function GetDescriptionOfSection()
{
    return [
        {name: 'sh_name'      , type: DATA_TYPES.UInt32, hex: true},
        {name: 'sh_type'      , type: DATA_TYPES.UInt32, hex: true},
        {name: 'sh_flags'     , type: DATA_TYPES.UInt64, hex: true},
        {name: 'sh_addr'      , type: DATA_TYPES.UInt64, hex: true},
        {name: 'sh_offset'    , type: DATA_TYPES.UInt64, hex: true},
        {name: 'sh_size'      , type: DATA_TYPES.UInt64, hex: true},
        {name: 'sh_link'      , type: DATA_TYPES.UInt32, hex: true},
        {name: 'sh_info'      , type: DATA_TYPES.UInt32, hex: true},
        {name: 'sh_addralign' , type: DATA_TYPES.UInt64, hex: true},
        {name: 'sh_entsize'   , type: DATA_TYPES.UInt64, hex: true},
    ]
}

function GetDescriptionOfSegment()
{
    return [
        {name: 'p_type'  , type: DATA_TYPES.UInt32, hex: true},
        {name: 'p_flags' , type: DATA_TYPES.UInt32, hex: true},
        {name: 'p_offset', type: DATA_TYPES.UInt64, hex: true},
        {name: 'p_vaddr' , type: DATA_TYPES.UInt64, hex: true},
        {name: 'p_paddr' , type: DATA_TYPES.UInt64, hex: true},
        {name: 'p_filesz', type: DATA_TYPES.UInt64, hex: true},
        {name: 'p_memsz' , type: DATA_TYPES.UInt64, hex: true},
        {name: 'p_align' , type: DATA_TYPES.UInt64, hex: true},
    ]
}

function GetCalcOffsetWithIdx(offset, entrySize)
{
    return function(idx){
        return offset + entrySize * idx
    }
}

class Elf {
    constructor(arrayBuffer)
    {
        this.buffer = arrayBuffer
        this.reader = new ByteData(this.buffer)
        this.length = this.reader.length

        this.elf_header = new DataRepresentation([
            {name: 'e_ident'     , type: new DATA_TYPES.Bytes(16)},
            {name: 'e_type'      , type: new DATA_TYPES.Bytes(2)},
            {name: 'e_machine'   , type: new DATA_TYPES.Bytes(2)},
            {name: 'e_version'   , type: DATA_TYPES.UInt32, hex: true},
            {name: 'e_entry'     , type: DATA_TYPES.UInt64, hex: true},
            {name: 'e_phoff'     , type: DATA_TYPES.UInt64, hex: true},
            {name: 'e_shoff'     , type: DATA_TYPES.UInt64, hex: true},
            {name: 'e_flags'     , type: DATA_TYPES.UInt32, hex: true},
            {name: 'e_ehsize'    , type: DATA_TYPES.UInt16, hex: true},
            {name: 'e_phentsize' , type: DATA_TYPES.UInt16, hex: true},
            {name: 'e_phnum'     , type: DATA_TYPES.UInt16},
            {name: 'e_shentsize' , type: DATA_TYPES.UInt16, hex: true},
            {name: 'e_shnum'     , type: DATA_TYPES.UInt16},
            {name: 'e_shstrndx'  , type: DATA_TYPES.UInt16},
        ], this.reader, 0);

        let sectionOffset = GetCalcOffsetWithIdx(this.elf_header.getLongData('e_shoff'),
                                                 this.elf_header.getLongData('e_shentsize'))
        this.sections = []
        for (let sectionCount = this.elf_header.getLongData('e_shnum'), idx = 0; idx < sectionCount; idx++)
        {
            this.sections.push(new DataRepresentation(GetDescriptionOfSection(), this.reader, sectionOffset(idx)))
        }

        let segmentOffset = GetCalcOffsetWithIdx(this.elf_header.getLongData('e_phoff'),
                                                 this.elf_header.getLongData('e_phentsize'))
        this.segments = []
        for (let segmentCount = this.elf_header.getLongData('e_phnum'), idx = 0; idx < segmentCount; idx++)
        {
            this.segments.push(new DataRepresentation(GetDescriptionOfSegment(), this.reader, segmentOffset(idx)))
        }
    }
}

function ParseElf(data)
{
    return new Elf(data)
}

export {
    ParseElf,
}
