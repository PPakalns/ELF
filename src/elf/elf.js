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

    get length()
    {
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
        this.description = description
        this.dataSize = this.calculateDataSize()
        this.data = {}
        this.view = parentView.getView(offset, this.dataSize)
        this.readData()
    }

    calculateDataSize()
    {
        let calculatedSize = 0;
        for (let desc of this.description)
        {
            if (desc instanceof DataRepresentation)
            {
                calculatedSize += desc.dataSize
            }
            calculatedSize += desc.type.size
        }
        return calculatedSize;
    }

    readData()
    {
        let offset = 0;
        if (this.description instanceof Array)
        {
            for (let desc of this.description)
            {
                offset += this.readType(desc, offset)
            }
        }
        else {
            this.readType(this.description, offset)
        }
    }

    getLongData(key)
    {
        // This could return wrong value if the stored number ir larger than 2^53 - 1
        // In normal elf files there are no such offsets or virtual addresses
        return this.data[key].toNumber()
    }

    readType(desc, offset)
    {
        if (desc.type instanceof DataRepresentation)
        {
            this.data[desc.name] = desc.type.getRepresentation()
            return desc.type.dataSize
        }
        this.data[desc.name] = this.view.readType(offset, desc.type)
        return desc.type.size
    }

    getRepresentation() {
        let repr = []
        for (let desc of this.description)
        {
            if (desc.type instanceof DataRepresentation)
            {
                repr.push({name: desc.name, value: desc.type.getRepresentation()})
            }
            else
            {
                repr.push(this.getValueFor(desc))
            }
        }
        return repr
    }

    getValueFor(desc)
    {
        let value = this.data[desc.name]
        if (desc.hex)
        {
            value = "0x" + value.toString(16)
        }
        return {name: desc.name, value: value};
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

function GetDescriptionOfIdent()
{
    return [
        {name: 'EI_MAG', type: new DATA_TYPES.Bytes(4)},
        {name: 'EI_CLASS', type: new DATA_TYPES.Bytes(1)},
        {name: 'EI_DATA', type: new DATA_TYPES.Bytes(1)},
        {name: 'EI_VERSION', type: new DATA_TYPES.Bytes(1)},
        {name: 'EI_OSABI', type: new DATA_TYPES.Bytes(1)},
        {name: 'EI_ABIVERSION', type: new DATA_TYPES.Bytes(1)},
        {name: 'EI_PAD', type: new DATA_TYPES.Bytes(7)},
    ];
}

function GetDescriptionOfElf(parentView)
{
    return [
        {name: 'e_ident', type: new DataRepresentation(GetDescriptionOfIdent(), parentView, 0)},
        {name: 'e_type', type: new DATA_TYPES.Bytes(2)},
        {name: 'e_machine', type: new DATA_TYPES.Bytes(2)},
        {name: 'e_version', type: DATA_TYPES.UInt32, hex: true},
        {name: 'e_entry', type: DATA_TYPES.UInt64, hex: true},
        {name: 'e_phoff', type: DATA_TYPES.UInt64, hex: true},
        {name: 'e_shoff', type: DATA_TYPES.UInt64, hex: true},
        {name: 'e_flags', type: DATA_TYPES.UInt32, hex: true},
        {name: 'e_ehsize', type: DATA_TYPES.UInt16, hex: true},
        {name: 'e_phentsize', type: DATA_TYPES.UInt16, hex: true},
        {name: 'e_phnum', type: DATA_TYPES.UInt16},
        {name: 'e_shentsize', type: DATA_TYPES.UInt16, hex: true},
        {name: 'e_shnum', type: DATA_TYPES.UInt16},
        {name: 'e_shstrndx', type: DATA_TYPES.UInt16},
    ]
}

function GetCalcOffsetWithIdx(offset, entrySize)
{
    return function(idx){
        return offset + entrySize * idx
    }
}

const SEGMENT_HEADER_TYPES = {
    0: 'PT_NULL',
    1: 'PT_LOAD',
    2: 'PT_DYNAMIC',
    3: 'PT_INTERP',
    4: 'PT_NOTE',
    5: 'PT_SHLIB',
    6: 'PT_PHDR',
}

function GetSegmentType(segmentHeader)
{
    let type = segmentHeader.getLongData('p_type')
    if (SEGMENT_HEADER_TYPES.hasOwnProperty(type))
    {
        return SEGMENT_HEADER_TYPES[type]
    }
    return 'UNKNOWN_TYPE'
}

class Elf
{
    constructor(arrayBuffer)
    {
        this.buffer = arrayBuffer;
        this.reader = new ByteData(this.buffer);
        this.length = this.reader.length;
        this.elf_header = new DataRepresentation(GetDescriptionOfElf(this.reader), this.reader, 0);

        let sectionOffset = GetCalcOffsetWithIdx(this.elf_header.getLongData('e_shoff'),
                                                 this.elf_header.getLongData('e_shentsize'))

        this.createSectionNameView(sectionOffset);

        this.sections = []
        for (let sectionCount = this.elf_header.getLongData('e_shnum'), idx = 0; idx < sectionCount; idx++)
        {
            let section_header = new DataRepresentation(GetDescriptionOfSection(), this.reader, sectionOffset(idx))
            this.sections.push({
                name: this.getSectionName(section_header.getLongData('sh_name')),
                header: section_header
            })
        }

        let segmentOffset = GetCalcOffsetWithIdx(this.elf_header.getLongData('e_phoff'),
                                                 this.elf_header.getLongData('e_phentsize'))
        this.segments = []
        for (let segmentCount = this.elf_header.getLongData('e_phnum'), idx = 0; idx < segmentCount; idx++)
        {
            let header = new DataRepresentation(GetDescriptionOfSegment(), this.reader, segmentOffset(idx))
            this.segments.push({
                name: GetSegmentType(header),
                header: header,
            })
        }
    }

    getSectionName(offset)
    {
        let name = ""
        for (let i = 0;;i++)
        {
            let char = this.sectionNameView.readBytes(parseInt(offset) + i, 1)[0]
            if (!char)
                break;
            name += String.fromCharCode([char])
        }
        if (name === "")
        {
            name = "NULL"
        }
        return name
    }

    createSectionNameView(sectionOffset)
    {
        let sectionNameId = this.elf_header.getLongData('e_shstrndx')
        let sectionNameHeader = new DataRepresentation(GetDescriptionOfSection(), this.reader, sectionOffset(sectionNameId))
        let sectionNameOffset = sectionNameHeader.getLongData('sh_offset')
        let sectionNameSize = sectionNameHeader.getLongData('sh_size')
        this.sectionNameView = this.reader.getView(sectionNameOffset, sectionNameSize)
    }
}

function ParseElf(data)
{
    return new Elf(data)
}

export {
    ParseElf,
}
