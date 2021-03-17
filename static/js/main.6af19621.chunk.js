(window["webpackJsonptheremin-ui"]=window["webpackJsonptheremin-ui"]||[]).push([[0],{122:function(n,e,o){n.exports=o(174)},167:function(n,e,o){},168:function(n,e){function o(n){var e=new Error("Cannot find module '"+n+"'");throw e.code="MODULE_NOT_FOUND",e}o.keys=function(){return[]},o.resolve=o,n.exports=o,o.id=168},169:function(n,e,o){},172:function(n,e,o){},173:function(n,e,o){},174:function(n,e,o){"use strict";o.r(e);var t,i=o(6),c=o.n(i),r=o(20),a=o.n(r),l=o(39),u=o.n(l),s=o(8),d=(o(129),o(47)),m=o(17),f=o(0),g=o(3),h=o(2),v=o(27),p=o(177),R=o(19),w=o(11),E=o(72),y=p.g.create({position:R.a.BOTTOM,usePortal:!0,canEscapeKeyClear:!0}),C=(o(167),Object({NODE_ENV:"production",PUBLIC_URL:"/web-theremin",REACT_APP_QKT_HOST:"",REACT_APP_QKT_PORT:"",REACT_APP_THEREMIN_HOST:"localhost",REACT_APP_THEREMIN_PORT:"5000"}));C.REACT_APP_THEREMIN_HOST,C.REACT_APP_THEREMIN_PORT;!function(n){n[n.Loading=0]="Loading",n[n.Playing=1]="Playing",n[n.Muted=2]="Muted"}(t||(t={}));var I,T=function(n){var e=n.frequency,o=n.volume,t=Math.log2(e/440),i=o/20,c=[t,i].map((function(n){return Math.floor((e=256*n,o=0,t=255,Math.max(o,Math.min(t,e))));var e,o,t})),r=Object(w.a)(c,2),a=r[0];r[1];return"rgba(".concat(a,",0,0,").concat(i,")")},M=function(n){Object(g.a)(o,n);var e=Object(h.a)(o);function o(n){var i;Object(f.a)(this,o),(i=e.call(this,n)).channel=void 0,i.osc=void 0,i.screenRef=void 0,i.myLocation=void 0,i.peerLocation=void 0,i.onOpen=function(){console.log("opened connection."),console.log("sending greeting.")},i.onError=function(n){console.log("Got an error",n)},i.onClose=function(){console.log("closed connection lol.")},i.onData=function(n){var e=n;i.peerLocation=e,i.updateSound()},i.onMouseDown=function(){i.osc.start(),i.setState({stage:t.Playing})},i.onMouseUp=function(){i.osc.stop(),i.setState({stage:t.Muted})},i.locsToSound=function(n){var e=function(n){return n.reduce((function(n,e){return n+e}))/n.length},o=n.map((function(n){return n.x})),t=n.map((function(n){return n.y})),i=e(o),c=e(t);return 0<=i&&i<=1&&0<=c&&c<=1?{frequency:440*Math.pow(2,i),volume:20*c}:null},i.normalize=function(n){var e=i.screenRef.current;if(null===e)return null;var o=e.getBoundingClientRect(),t=o.height,c=o.width;return{x:n.x/c,y:n.y/t}},i.onMouseMove=function(n){var e=i.normalize({x:n.x,y:n.y});null!==e&&(i.myLocation=e,i.updateSound())},i.updateSound=function(){var n=i.locsToSound([i.myLocation,i.peerLocation]);if(null!==n){i.channel.sendData(i.myLocation);var e=n.frequency,o=n.volume;i.osc.frequency.value=e,i.osc.volume.value=o;var c=i.state.stage;if(c===t.Playing){var r=T(n);i.setState({stage:c,color:r})}}},i.componentDidMount=function(){y.show({timeout:2e3,message:"Successfully joined room",icon:"tick",intent:v.a.SUCCESS}),window.addEventListener("mousedown",i.onMouseDown),window.addEventListener("mouseup",i.onMouseUp),window.addEventListener("mousemove",i.onMouseMove),i.setState({stage:t.Playing})},i.componentWillUnmount=function(){window.removeEventListener("mousedown",i.onMouseDown),window.removeEventListener("mouseup",i.onMouseUp),window.removeEventListener("mousemove",i.onMouseMove)},i.render=function(){var n=i.state,e=n.stage,o=n.color;return c.a.createElement("div",{className:"full",ref:i.screenRef,style:{borderColor:e===t.Playing?o:"#000000",borderWidth:"7px",borderStyle:"solid"}},c.a.createElement("h1",null,i.channel.id),e===t.Loading&&c.a.createElement(p.f,null))};var r=n.channel;return i.peerLocation={x:0,y:0},i.myLocation={x:0,y:0},i.channel=r,i.channel.openRoom({onClose:i.onClose,onData:i.onData,onError:i.onError,onOpen:i.onOpen}),i.osc=new E.a({type:"sine",frequency:440,volume:-10}).toDestination(),i.screenRef=c.a.createRef(),i.state={color:"#000000",stage:t.Loading},i}return o}(c.a.Component),O=o(1),P=o(70),b=o.n(P),L=function(){function n(e){var o=this;Object(f.a)(this,n),this.connection=null,this.peer=null,this.onClose=void 0,this.onData=void 0,this.onError=void 0,this.onOpen=void 0,this.onIdGiven=void 0,this.peerId=null,this.myId=null,this.openRoom=function(n){var e=n.onClose,t=n.onData,i=n.onError,c=n.onOpen;o.onClose=e,o.onData=t,o.onError=i,o.onOpen=c},this.sendData=function(n){return!(null===o.connection||!o.connection.open)&&(o.connection.send(n),!0)},this.setHandlers=function(){o.peer.on("open",(function(n){console.log("open called"),o.connectToRoom(n)})),o.peer.on("connection",(function(n){console.log("connection called"),o.onConnection(n)})),o.peer.on("error",(function(n){console.log("got an error ..."),console.error("error",n)})),o.peer.on("close",(function(){return console.log("closing ...")})),o.peer.on("disconnected",(function(){return console.log("disconnected ...")}))},this.connectToRoom=function(n){o.myId=n,console.log("my id:",o.myId),o.onIdGiven(n),null!==o.peerId&&(console.log("Trying to connect to peer ".concat(o.peerId,".")),o.connection=o.peer.connect(o.peerId,{reliable:!0}),o.setConnectionHandlers())},this.setConnectionHandlers=function(){null!==o.connection&&(console.log("Connected to:",o.connection.peer),o.connection.on("close",(function(){console.log("Connection Closed"),o.connection=null,o.onClose()})),o.connection.on("data",(function(n){o.onData(n)})),o.connection.on("error",(function(n){console.error(" error ... ",n),o.onError(n)})),o.connection.on("open",(function(){console.log(" open ... "),o.onOpen()})))},this.onConnection=function(n){if(console.log("Recieved connection"),null!==o.connection&&o.connection.open)return console.log("Second connection attempt refused"),void n.on("open",(function(){n.send("Already connected to another client."),n.close()}));o.connection=n,o.setConnectionHandlers()};var t=e.peerId,i=e.onIdGiven;this.onIdGiven=i||function(){},this.peerId=t||null,this.peer=new b.a(void 0,{secure:!0,host:"web-theremin-peer-js-server.herokuapp.com",port:443,key:"CheR4uo4",debug:1}),this.setHandlers()}return Object(O.a)(n,[{key:"id",get:function(){return this.myId}}]),n}();o(169);!function(n){n[n.WaitingForId=0]="WaitingForId",n[n.ReadyToJoinRoom=1]="ReadyToJoinRoom",n[n.JoiningRoom=2]="JoiningRoom"}(I||(I={}));var S=function(n){Object(g.a)(o,n);var e=Object(h.a)(o);function o(n){var t;return Object(f.a)(this,o),(t=e.call(this,n)).channel=void 0,t.componentDidMount=function(){},t.onIdGiven=function(){t.setState({action:I.ReadyToJoinRoom})},t.joinRoom=function(){t.setState({action:I.JoiningRoom})},t.launchNewRoom=function(){y.show({timeout:2e3,message:"Launching new room ...",icon:"drawer-left",intent:v.a.PRIMARY}),t.joinRoom()},t.joinExistingRoom=function(){y.show({timeout:2e3,message:"Joining existing room ...",icon:"drawer-left",intent:v.a.PRIMARY});var n=t.state.peerId;t.channel=new L({peerId:n}),t.joinRoom()},t.setNewRoom=function(n){return t.setState({creatingNewRoom:n})},t.onCodeChange=function(n){var e=n.target.value,o=n.target,i=o.selectionStart,c=o.selectionEnd;return t.setState({peerId:e},(function(){return o.setSelectionRange(i||0,c||0)}))},t.render=function(){var n=t.state,e=n.creatingNewRoom,o=n.peerId,i=n.action;if(i===I.JoiningRoom)return c.a.createElement(M,{channel:t.channel});var r=c.a.createElement(p.e,{content:c.a.createElement(p.c,null,c.a.createElement(p.d,{text:"Create New Room",onClick:function(){return t.setNewRoom(!0)}}),c.a.createElement(p.d,{text:"Join Existing Room",onClick:function(){return t.setNewRoom(!1)}})),position:R.a.BOTTOM_RIGHT},c.a.createElement(p.a,{rightIcon:"caret-down",text:e?"Create New Room":"Join Existing Room"}));return c.a.createElement("div",null,c.a.createElement("h1",null,"Theremin"),c.a.createElement(p.b,{disabled:e,large:!0,placeholder:"",rightElement:r,onChange:t.onCodeChange,value:o}),i!==I.WaitingForId&&c.a.createElement(p.a,{large:!0,intent:v.a.PRIMARY,text:"Launch!",onClick:e?t.launchNewRoom:t.joinExistingRoom}))},t.channel=new L({onIdGiven:t.onIdGiven}),t.state={creatingNewRoom:!1,peerId:"",action:I.WaitingForId},t}return o}(c.a.Component),_=Object(m.e)(S),x=function(){return c.a.createElement(d.a,null,c.a.createElement(m.a,{exact:!0,path:"".concat("/web-theremin","/"),render:function(n){return c.a.createElement(_,n)}}))};o(172);u.a.config();var N=function(){return c.a.createElement("div",{className:"App ".concat(s.a.DARK),style:{width:"100vw",height:"100vh"}},c.a.createElement(x,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o(173);u.a.config(),a.a.render(c.a.createElement(N,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(n){n.unregister()}))}},[[122,1,2]]]);
//# sourceMappingURL=main.6af19621.chunk.js.map