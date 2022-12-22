(self["webpackChunkvue_app"]=self["webpackChunkvue_app"]||[]).push([[523],{9645:function(t,e,a){"use strict";a.r(e),a.d(e,{default:function(){return f}});var i=function(){var t=this,e=t._self._c;return e("main",[e("Loading",{attrs:{active:t.isLoading,"is-full-page":!0,"can-cancel":!1}}),e("div",{staticClass:"flex items-center mb-4 text-green-700 font-bold text-lg uppercase"},[e("ThemifyIcon",{attrs:{icon:"menu"}}),e("h1",{staticClass:"ml-2"},[t._v("Create new account")])],1),e("div",{staticClass:"mb-6"},[e("div",{staticClass:"mb-2 text-md font-medium text-gray-900 flex items-center"},[e("ThemifyIcon",{attrs:{icon:"settings"}}),e("p",{staticClass:"ml-2"},[t._v("Import accounts from excel:")])],1),e("div",{staticClass:"flex mb-6"},[e("input",{ref:"file",staticClass:"block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer pl-2 py-2 mr-4",attrs:{type:"file"},on:{change:t.uploadFile}}),e("div",{staticClass:"flex justify-center items-center bg-blue-400 hover:bg-blue-500 transition-all text-white w-80 text-center rounded cursor-pointer",on:{click:t.importExcelHandler}},[e("ThemifyIcon",{attrs:{icon:"upload"}}),e("button",{staticClass:"ml-2"},[t._v("Import")])],1)]),e("div",{staticClass:"mb-2 text-md font-medium text-gray-900 flex items-center"},[e("ThemifyIcon",{attrs:{icon:"settings"}}),e("p",{staticClass:"ml-2"},[t._v("Download file format of excel to import accounts:")])],1),e("div",{staticClass:"flex justify-center items-center bg-green-400 hover:bg-green-500 transition-all text-white w-60 py-2 rounded mb-3 cursor-pointer",on:{click:t.downloadExampleHandler}},[e("ThemifyIcon",{attrs:{icon:"download"}}),e("button",{staticClass:"ml-2"},[t._v("Donwload example")])],1)]),e("div",[e("div",{staticClass:"mb-2 text-md font-medium text-gray-900 flex items-center"},[e("ThemifyIcon",{attrs:{icon:"settings"}}),e("p",{staticClass:"ml-2"},[t._v("Insert new product manually:")])],1),e("div",{staticClass:"grid gap-6 mb-6 md:grid-cols-2"},[e("div",[e("label",{staticClass:"block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"},[t._v("User code")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.userCode,expression:"userCode"}],staticClass:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",attrs:{type:"text",placeholder:"User code",required:""},domProps:{value:t.userCode},on:{input:function(e){e.target.composing||(t.userCode=e.target.value)}}})]),e("div",[e("label",{staticClass:"block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"},[t._v("Full name")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.fullName,expression:"fullName"}],staticClass:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",attrs:{type:"text",placeholder:"Fullname",required:""},domProps:{value:t.fullName},on:{input:function(e){e.target.composing||(t.fullName=e.target.value)}}})]),e("div",[e("label",{staticClass:"block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"},[t._v("Email")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.email,expression:"email"}],staticClass:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",attrs:{type:"email",placeholder:"example@gmail.com",required:""},domProps:{value:t.email},on:{input:function(e){e.target.composing||(t.email=e.target.value)}}})]),e("div",[e("label",{staticClass:"block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"},[t._v("Phone number")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.phoneNumber,expression:"phoneNumber"}],staticClass:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",attrs:{type:"tel",placeholder:"0123-456-789",pattern:"[0-9]{4}-[0-9]{3}-[0-9]{3}",required:""},domProps:{value:t.phoneNumber},on:{input:function(e){e.target.composing||(t.phoneNumber=e.target.value)}}})])]),e("div",{staticClass:"mb-6"},[e("label",{staticClass:"block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300",attrs:{for:"password"}},[t._v("Password")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",attrs:{type:"password",id:"password",placeholder:"Password",required:""},domProps:{value:t.password},on:{input:function(e){e.target.composing||(t.password=e.target.value)}}})]),e("div",{staticClass:"mb-6"},[e("label",{staticClass:"block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"},[t._v("Role")]),e("select",{directives:[{name:"model",rawName:"v-model",value:t.role,expression:"role"}],staticClass:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5",on:{change:function(e){var a=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.role=e.target.multiple?a:a[0]}}},[e("option",{attrs:{value:"STAFF",selected:""}},[t._v("STAFF")]),e("option",{attrs:{value:"MANAGER"}},[t._v("MANAGER")])])]),e("button",{staticClass:"text-white transition-all bg-blue-400 hover:bg-blue-500 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-2.5 text-center",attrs:{type:"submit"},on:{click:t.registerAccountHandler}},[t._v(" Submit ")])])],1)},r=[],n=a(594),o=a(7973),s=a(629),l=a(7398),u=a.n(l),c={components:{ThemifyIcon:o.Z,Loading:u()},data(){return{isLoading:!1,fileImport:null,userCode:null,fullName:null,email:null,phoneNumber:null,password:null,role:"STAFF"}},methods:{uploadFile(){this.fileImport=this.$refs.file.files[0]},async downloadExampleHandler(){await(0,n.Z)({url:`http://localhost:8080/api/v1/account/download-example?token=${this.accessToken}`,method:"GET",responseType:"blob"}).then((t=>{const e=window.URL.createObjectURL(new Blob([t.data])),a=document.createElement("a");a.href=e;const i="account-example.xlsx";a.setAttribute("download",i),a.setAttribute("target","_blank"),document.body.appendChild(a),a.click(),a.remove()}))},async importExcelHandler(){this.isLoading=!0;const t=new FormData;t.append("file",this.fileImport);const e={"Content-Type":"multipart/form-data"};await n.Z.post(`http://localhost:8080/api/v1/account/import?token=${this.accessToken}`,t,{headers:e}).then((t=>{t.data.status?this.toastify.success(t.data.msg.en):this.toastify.error(t.data.msg.en)})).catch((t=>{this.toastify.error(t.response.data.msg.en)})),this.isLoading=!1},async registerAccountHandler(){this.isLoading=!0,await n.Z.post(`http://localhost:8080/api/v1/account/register?token=${this.accessToken}`,{userCode:this.userCode,fullName:this.fullName,email:this.email,phoneNumber:this.phoneNumber,password:this.password,role:this.role}).then((t=>{t.data.status?(this.toastify.success(t.data.msg.en),this.fileImport=null,this.userCode=null,this.fullName=null,this.email=null,this.phoneNumber=null,this.password=null,this.role=null):this.toastify.error(t.data.msg.en)})).catch((t=>{this.toastify.error(t.response.data.msg.en)})),this.isLoading=!1}},computed:{...(0,s.rn)(["accessToken","payload","toastify"])}},d=c,m=a(1001),p=(0,m.Z)(d,i,r,!1,null,null,null),f=p.exports},7398:function(t){!function(e,a){t.exports=a()}("undefined"!=typeof self&&self,(function(){return function(t){var e={};function a(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,a),r.l=!0,r.exports}return a.m=t,a.c=e,a.d=function(t,e,i){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(a.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)a.d(i,r,function(e){return t[e]}.bind(null,r));return i},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=1)}([function(t,e,a){},function(t,e,a){"use strict";a.r(e);var i="undefined"!=typeof window?window.HTMLElement:Object,r={mounted:function(){this.enforceFocus&&document.addEventListener("focusin",this.focusIn)},methods:{focusIn:function(t){if(this.isActive&&t.target!==this.$el&&!this.$el.contains(t.target)){var e=this.container?this.container:this.isFullPage?null:this.$el.parentElement;(this.isFullPage||e&&e.contains(t.target))&&(t.preventDefault(),this.$el.focus())}}},beforeDestroy:function(){document.removeEventListener("focusin",this.focusIn)}};function n(t,e,a,i,r,n,o,s){var l,u="function"==typeof t?t.options:t;if(e&&(u.render=e,u.staticRenderFns=a,u._compiled=!0),i&&(u.functional=!0),n&&(u._scopeId="data-v-"+n),o?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),r&&r.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o)},u._ssrRegister=l):r&&(l=s?function(){r.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:r),l)if(u.functional){u._injectStyles=l;var c=u.render;u.render=function(t,e){return l.call(e),c(t,e)}}else{var d=u.beforeCreate;u.beforeCreate=d?[].concat(d,l):[l]}return{exports:t,options:u}}var o=n({name:"spinner",props:{color:{type:String,default:"#000"},height:{type:Number,default:64},width:{type:Number,default:64}}},(function(){var t=this.$createElement,e=this._self._c||t;return e("svg",{attrs:{viewBox:"0 0 38 38",xmlns:"http://www.w3.org/2000/svg",width:this.width,height:this.height,stroke:this.color}},[e("g",{attrs:{fill:"none","fill-rule":"evenodd"}},[e("g",{attrs:{transform:"translate(1 1)","stroke-width":"2"}},[e("circle",{attrs:{"stroke-opacity":".25",cx:"18",cy:"18",r:"18"}}),e("path",{attrs:{d:"M36 18c0-9.94-8.06-18-18-18"}},[e("animateTransform",{attrs:{attributeName:"transform",type:"rotate",from:"0 18 18",to:"360 18 18",dur:"0.8s",repeatCount:"indefinite"}})],1)])])])}),[],!1,null,null,null).exports,s=n({name:"dots",props:{color:{type:String,default:"#000"},height:{type:Number,default:240},width:{type:Number,default:60}}},(function(){var t=this.$createElement,e=this._self._c||t;return e("svg",{attrs:{viewBox:"0 0 120 30",xmlns:"http://www.w3.org/2000/svg",fill:this.color,width:this.width,height:this.height}},[e("circle",{attrs:{cx:"15",cy:"15",r:"15"}},[e("animate",{attrs:{attributeName:"r",from:"15",to:"15",begin:"0s",dur:"0.8s",values:"15;9;15",calcMode:"linear",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"fill-opacity",from:"1",to:"1",begin:"0s",dur:"0.8s",values:"1;.5;1",calcMode:"linear",repeatCount:"indefinite"}})]),e("circle",{attrs:{cx:"60",cy:"15",r:"9","fill-opacity":"0.3"}},[e("animate",{attrs:{attributeName:"r",from:"9",to:"9",begin:"0s",dur:"0.8s",values:"9;15;9",calcMode:"linear",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"fill-opacity",from:"0.5",to:"0.5",begin:"0s",dur:"0.8s",values:".5;1;.5",calcMode:"linear",repeatCount:"indefinite"}})]),e("circle",{attrs:{cx:"105",cy:"15",r:"15"}},[e("animate",{attrs:{attributeName:"r",from:"15",to:"15",begin:"0s",dur:"0.8s",values:"15;9;15",calcMode:"linear",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"fill-opacity",from:"1",to:"1",begin:"0s",dur:"0.8s",values:"1;.5;1",calcMode:"linear",repeatCount:"indefinite"}})])])}),[],!1,null,null,null).exports,l=n({name:"bars",props:{color:{type:String,default:"#000"},height:{type:Number,default:40},width:{type:Number,default:40}}},(function(){var t=this.$createElement,e=this._self._c||t;return e("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 30 30",height:this.height,width:this.width,fill:this.color}},[e("rect",{attrs:{x:"0",y:"13",width:"4",height:"5"}},[e("animate",{attrs:{attributeName:"height",attributeType:"XML",values:"5;21;5",begin:"0s",dur:"0.6s",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"y",attributeType:"XML",values:"13; 5; 13",begin:"0s",dur:"0.6s",repeatCount:"indefinite"}})]),e("rect",{attrs:{x:"10",y:"13",width:"4",height:"5"}},[e("animate",{attrs:{attributeName:"height",attributeType:"XML",values:"5;21;5",begin:"0.15s",dur:"0.6s",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"y",attributeType:"XML",values:"13; 5; 13",begin:"0.15s",dur:"0.6s",repeatCount:"indefinite"}})]),e("rect",{attrs:{x:"20",y:"13",width:"4",height:"5"}},[e("animate",{attrs:{attributeName:"height",attributeType:"XML",values:"5;21;5",begin:"0.3s",dur:"0.6s",repeatCount:"indefinite"}}),e("animate",{attrs:{attributeName:"y",attributeType:"XML",values:"13; 5; 13",begin:"0.3s",dur:"0.6s",repeatCount:"indefinite"}})])])}),[],!1,null,null,null).exports,u=n({name:"vue-loading",mixins:[r],props:{active:Boolean,programmatic:Boolean,container:[Object,Function,i],isFullPage:{type:Boolean,default:!0},enforceFocus:{type:Boolean,default:!0},lockScroll:{type:Boolean,default:!1},transition:{type:String,default:"fade"},canCancel:Boolean,onCancel:{type:Function,default:function(){}},color:String,backgroundColor:String,blur:{type:String,default:"2px"},opacity:Number,width:Number,height:Number,zIndex:Number,loader:{type:String,default:"spinner"}},data:function(){return{isActive:this.active}},components:{Spinner:o,Dots:s,Bars:l},beforeMount:function(){this.programmatic&&(this.container?(this.isFullPage=!1,this.container.appendChild(this.$el)):document.body.appendChild(this.$el))},mounted:function(){this.programmatic&&(this.isActive=!0),document.addEventListener("keyup",this.keyPress)},methods:{cancel:function(){this.canCancel&&this.isActive&&(this.hide(),this.onCancel.apply(null,arguments))},hide:function(){var t=this;this.$emit("hide"),this.$emit("update:active",!1),this.programmatic&&(this.isActive=!1,setTimeout((function(){var e;t.$destroy(),void 0!==(e=t.$el).remove?e.remove():e.parentNode.removeChild(e)}),150))},disableScroll:function(){this.isFullPage&&this.lockScroll&&document.body.classList.add("vld-shown")},enableScroll:function(){this.isFullPage&&this.lockScroll&&document.body.classList.remove("vld-shown")},keyPress:function(t){27===t.keyCode&&this.cancel()}},watch:{active:function(t){this.isActive=t},isActive:function(t){t?this.disableScroll():this.enableScroll()}},computed:{bgStyle:function(){return{background:this.backgroundColor,opacity:this.opacity,backdropFilter:"blur(".concat(this.blur,")")}}},beforeDestroy:function(){document.removeEventListener("keyup",this.keyPress)}},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("transition",{attrs:{name:t.transition}},[a("div",{directives:[{name:"show",rawName:"v-show",value:t.isActive,expression:"isActive"}],staticClass:"vld-overlay is-active",class:{"is-full-page":t.isFullPage},style:{zIndex:t.zIndex},attrs:{tabindex:"0","aria-busy":t.isActive,"aria-label":"Loading"}},[a("div",{staticClass:"vld-background",style:t.bgStyle,on:{click:function(e){return e.preventDefault(),t.cancel(e)}}}),a("div",{staticClass:"vld-icon"},[t._t("before"),t._t("default",[a(t.loader,{tag:"component",attrs:{color:t.color,width:t.width,height:t.height}})]),t._t("after")],2)])])}),[],!1,null,null,null).exports,c=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return{show:function(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:a,n={programmatic:!0},o=Object.assign({},e,i,n),s=new(t.extend(u))({el:document.createElement("div"),propsData:o}),l=Object.assign({},a,r);return Object.keys(l).map((function(t){s.$slots[t]=l[t]})),s}}};a(0),u.install=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=c(t,e,a);t.$loading=i,t.prototype.$loading=i},e.default=u}]).default}))}}]);
//# sourceMappingURL=accountRegister.861625cf.js.map