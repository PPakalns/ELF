(function(e){function t(t){for(var r,l,s=t[0],u=t[1],o=t[2],c=0,h=[];c<s.length;c++)l=s[c],a[l]&&h.push(a[l][0]),a[l]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);f&&f(t);while(h.length)h.shift()();return i.push.apply(i,o||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,s=1;s<n.length;s++){var u=n[s];0!==a[u]&&(r=!1)}r&&(i.splice(t--,1),e=l(l.s=n[0]))}return e}var r={},a={app:0},i=[];function l(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,l),n.l=!0,n.exports}l.m=e,l.c=r,l.d=function(e,t,n){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(l.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)l.d(n,r,function(t){return e[t]}.bind(null,r));return n},l.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],u=s.push.bind(s);s.push=t,s=s.slice();for(var o=0;o<s.length;o++)t(s[o]);var f=u;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var r=n("64a9"),a=n.n(r);a.a},"1bdb":function(e,t,n){},5430:function(e,t,n){"use strict";var r=n("af21"),a=n.n(r);a.a},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("h1",[e._v("ELF visualiser")]),e.elf?n("ElfFileVisualiser",{attrs:{elf:e.elf}}):n("ElfFileSelector",{model:{value:e.elf,callback:function(t){e.elf=t},expression:"elf"}})],1)},i=[],l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h3",[e._v("Please select an ELF file")]),n("FileSelector",{model:{value:e.tmpval,callback:function(t){e.tmpval=t},expression:"tmpval"}})],1)},s=[],u=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("label",{staticClass:"file-select"},[n("div",{staticClass:"select-button"},[e.value?n("span",[e._v("Selected File: "+e._s(e.value.name))]):n("span",[e._v("Select File")])]),n("input",{attrs:{type:"file"},on:{change:e.handleFileChange}})])},o=[],f={props:{value:null},methods:{handleFileChange:function(e){this.$emit("input",e.target.files[0])}}},c=f,h=(n("d3ad"),n("2877")),d=Object(h["a"])(c,u,o,!1,null,"fe7cd47a",null),p=d.exports,v={name:"ElfFileSelector",components:{FileSelector:p},props:{value:null},data:function(){return{tmpval:null}},watch:{tmpval:function(e){this.$emit("input",e)}}},y=v,m=Object(h["a"])(y,l,s,!1,null,"0f859216",null),b=m.exports,w=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.data?n("span",[e._v("File size: "+e._s(e.data.length)+" bytes")]):e._e(),e.data?n("ShowList",{attrs:{title:"ELF header",list:e.elf_header}}):e._e()],1)},_=[],g=(n("7f7f"),n("34ef"),n("6b54"),n("5d73")),I=n.n(g),x=n("d225"),O=n("b0b4"),k=n("da5a"),U=n.n(k);function E(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;if(e.length>=t)return e;for(var n="",r=2-e.length;r>0;r--)n+="0";return n+e}var j=function(){function e(t){Object(x["a"])(this,e),this.size=t,this.data=null}return Object(O["a"])(e,[{key:"SetData",value:function(e){this.data=e}},{key:"toString",value:function(){var e=[],t=!0,n=!1,r=void 0;try{for(var a,i=I()(this.data);!(t=(a=i.next()).done);t=!0){var l=a.value;e.push(E(l.toString(16)))}}catch(s){n=!0,r=s}finally{try{t||null==i.return||i.return()}finally{if(n)throw r}}return e.join(" ")}}]),e}(),S={UInt64:{size:8},UInt32:{size:4},UInt16:{size:2},Int64:{size:8},Int32:{size:4},Bytes:j},B=function(){function e(t,n,r){Object(x["a"])(this,e),this.buffer=t,this.offset=n,this.length=r}return Object(O["a"])(e,[{key:"checkRange",value:function(e,t){if(e<0)throw new Error("Offset smaller than zero");if(e+t>this.length)throw new Error("Offset overshot file end")}},{key:"readBytes",value:function(e,t){this.checkRange(e,t);for(var n=[],r=0;r<t;r++)n.push(this.buffer[this.offset+e+r]);return n}},{key:"getView",value:function(t,n){return this.checkRange(t,n),new e(this.buffer,this.offset+t,n)}},{key:"readUInt64",value:function(e){return new U.a.fromBytesLE(this.readBytes(e,8),!0)}},{key:"readUInt32",value:function(e){return new U.a.fromBytesLE(this.readBytes(e,4),!0)}},{key:"readUInt16",value:function(e){return new U.a.fromBytesLE(this.readBytes(e,2),!0)}},{key:"readInt64",value:function(e){return new U.a.fromBytesLE(this.readBytes(e,8),!1)}},{key:"readInt32",value:function(e){return new U.a.fromBytesLE(this.readBytes(e,4),!1)}},{key:"readType",value:function(e,t){if(t instanceof S.Bytes){var n=t;return n.SetData(this.readBytes(e,t.size)),t}switch(t){case S.UInt64:return this.readUInt64(e);case S.Int64:return this.readInt64(e);case S.UInt32:return this.readUInt32(e);case S.Int32:return this.readInt32(e);case S.UInt16:return this.readUInt16(e);default:throw Error("Unsupported type "+t)}}}]),e}(),F=function(){function e(t){Object(x["a"])(this,e),this.buffer=new Uint8Array(t)}return Object(O["a"])(e,[{key:"getView",value:function(e,t){if(e<0)throw new Error("Offset smaller than zero");if(e+t>this.buffer.byteLength)throw new Error("Offset overshot file end");return new B(this.buffer,e,t)}},{key:"length",get:function(){return this.buffer.byteLength}}]),e}(),z=function(){function e(t,n,r){Object(x["a"])(this,e);var a=0,i=!0,l=!1,s=void 0;try{for(var u,o=I()(t);!(i=(u=o.next()).done);i=!0){var f=u.value;a+=f.type.size}}catch(c){l=!0,s=c}finally{try{i||null==o.return||o.return()}finally{if(l)throw s}}this.view=n.getView(r,a),this.description=t,this.data={},this.readData()}return Object(O["a"])(e,[{key:"readData",value:function(){var e=0,t=!0,n=!1,r=void 0;try{for(var a,i=I()(this.description);!(t=(a=i.next()).done);t=!0){var l=a.value;this.data[l.name]=this.view.readType(e,l.type),e+=l.type.size}}catch(s){n=!0,r=s}finally{try{t||null==i.return||i.return()}finally{if(n)throw r}}}},{key:"getRepresentation",value:function(){var e=[],t=!0,n=!1,r=void 0;try{for(var a,i=I()(this.description);!(t=(a=i.next()).done);t=!0){var l=a.value,s=this.data[l.name];l.hex&&(s="0x"+s.toString(16)),e.push({name:l.name,value:s})}}catch(u){n=!0,r=u}finally{try{t||null==i.return||i.return()}finally{if(n)throw r}}return e}},{key:"length",get:function(){return this.view.length}}]),e}(),L=function e(t){Object(x["a"])(this,e),this.buffer=t,this.reader=new F(this.buffer),this.length=this.reader.length,this.elf_header=new z([{name:"e_ident",type:new S.Bytes(16)},{name:"e_type",type:new S.Bytes(2)},{name:"e_machine",type:new S.Bytes(2)},{name:"e_version",type:S.UInt32,hex:!0},{name:"e_entry",type:S.UInt64,hex:!0},{name:"e_phoff",type:S.UInt64,hex:!0},{name:"e_shoff",type:S.UInt64,hex:!0},{name:"e_flags",type:S.UInt32,hex:!0},{name:"e_ehsize",type:S.UInt16,hex:!0},{name:"e_phentsize",type:S.UInt16,hex:!0},{name:"e_phnum",type:S.UInt16},{name:"e_shentsize",type:S.UInt16,hex:!0},{name:"e_shnum",type:S.UInt16},{name:"e_shstrndx",type:S.UInt16}],this.reader,0)};function $(e){return new L(e)}var P=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h4",[e._v(e._s(e.title))]),n("dl",{staticClass:"demo",attrs:{id:"v-for-list"}},[e._l(e.list,function(t,r){return[n("dt",{key:r},[e._v(e._s(t.name))]),n("dd",{key:r},[e._v(e._s(t.value))])]})],2)])},R=[],V={name:"ShowList",props:{title:null,list:null}},C=V,T=(n("5430"),Object(h["a"])(C,P,R,!1,null,"7e1fe452",null)),D=T.exports,M={name:"ElfFileVisualiser",components:{ShowList:D},props:{elf:null},data:function(){return{data:null}},watch:{elf:{handler:function(e){var t=this;if(e){var n=new FileReader;n.onload=function(e){t.data=$(e.target.result)},n.readAsArrayBuffer(e)}},immediate:!0}},computed:{elf_header:function(){if(this.data)return this.data.elf_header.getRepresentation()}}},A=M,J=Object(h["a"])(A,w,_,!1,null,"6eea91ab",null),q=J.exports,G={name:"app",data:function(){return{elf:null}},components:{ElfFileSelector:b,ElfFileVisualiser:q}},H=G,K=(n("034f"),Object(h["a"])(H,a,i,!1,null,null,null)),N=K.exports;r["a"].config.productionTip=!1,new r["a"]({render:function(e){return e(N)}}).$mount("#app")},"64a9":function(e,t,n){},af21:function(e,t,n){},d3ad:function(e,t,n){"use strict";var r=n("1bdb"),a=n.n(r);a.a}});
//# sourceMappingURL=app.19b0e1fb.js.map