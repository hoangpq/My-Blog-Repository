if(!(window.MS&&MS.Support&&MS.Support.Fms)){throw "Missing namespace MS.Support.Fms. \ngsfx/gsfxsurvey.js should be rendered after survey.js.";}if(!MS.Support.Fms.Gsfx){MS.Support.Fms.Gsfx={};}if(!MS.Support.Fms.Gsfx.GsfxSurvey){MS.Support.Fms.Gsfx.GsfxSurvey=function(survey){
var Fms=MS.Support.Fms;var Survey=Fms.Survey;var Utils=Fms.Utils;var QuitMode={"giveup" : 1,"cancel" : 2,"persist" : 0};function getQuitModeByAction(action){var quitMode=QuitMode[action.toLowerCase()];if(quitMode==null){throw "Unknown action: "+action;}return quitMode;}function postback(survey,action){if(survey.isThankyouPage){return;}var quitMode=getQuitModeByAction(action);if(survey.suppressSubmission){if(quitMode==0){if(survey.thankyou!=null){survey.thankyou.show();}}return true;}if(surveyStyle=="embedded"){action="FINISHEMBED:"+survey.submitFields["FMSURL"];}survey.addSubmitField("FMSACTION",action);if(survey.parameters){survey.addSubmitField("PARAMLENGTH",survey.parameters.length);survey.addSubmitField("PARAMS",survey.parameters.join(","));}var surveyAnswers=survey.encodeAnswers(function(input){return unicodeFixup(escape(input));});survey.addSubmitField("DATALENGTH",surveyAnswers.split("|").length);survey.addSubmitField("SURVEYANSWERS",surveyAnswers+"|"+quitMode);if(isKBEmbedded){survey.addSubmitField("CONTENTTYPE",StatsDotNet.contentType);survey.addSubmitField("CONTENTCULTURE",StatsDotNet.ContentCulture);survey.addSubmitField("CONTENTID",StatsDotNet.contentId);survey.addSubmitField("CONTENTLCID",StatsDotNet.contentLn);survey.addSubmitField("SITECULTURE",StatsDotNet.SiteCulture);survey.addSubmitField("SSID",StatsDotNet.ssId);survey.addSubmitField("SITEBRANDID",StatsDotNet.siteBrandId);survey.addSubmitField("SSVERSION",StatsDotNet.SsVersion);survey.addSubmitField("CONTENTPROPERTIES",StatsDotNet.ContentProperties);}var submitFrame=Utils.getChildById(survey.domObject,"submitframe");if(submitFrame!=null){var frameDocument;if(submitFrame.contentDocument){frameDocument=submitFrame.contentDocument;}else{frameDocument=submitFrame.contentWindow.document;}var submitForm=frameDocument.forms[0];if(submitForm!=null){var frameFields=submitForm.elements;for(var field in survey.submitFields){if(frameFields[field]!=null){frameFields[field].value=survey.submitFields[field];}}if(survey.isInvitation||surveyStyle=="embedded"){submitForm.target="_parent";submitForm.submit();delayHalfSecond();return;}else{if(quitMode==QuitMode.persist){if(isKBEmbedded){setKBVisited();}addEventHandler(frameDocument.parentWindow ? frameDocument.parentWindow : frameDocument.defaultView,"unload",function(){submitFrame.parentNode.removeChild(submitFrame);if(survey.thankyou!=null){survey.thankyou.show();}});}try{submitForm.submit();if(quitMode==QuitMode.giveup){delayHalfSecond(1500);}}catch(e){}if(survey.isStandalone&&(!survey.isInvitation)&&surveyStyle!="embedded"&&quitMode==QuitMode.cancel){window.top.close();location.reload();}}}}}function handleInvitationSubmit(survey,action){var surveyDiv;var isPersist=((action=="persist")? true : false);if(!isPersist){postback(survey,"cancel");}try{surveyDiv=window.parent.document.getElementById('surveyDivBlock');surveyDiv.style.display='none';surveyDiv.style.height=0;surveyDiv.firstChild.style.height=0;}catch(e){}if(isPersist){if(survey.isPreview){window.location.href=Replace(window.location.href,"surveyinvite.aspx","survey.aspx");return;}else if(survey.isOnUnloadSurvey){var surveywin=window.top.open(Replace(window.location.href,"surveyinvite.aspx","survey.aspx"),"","resizable=1,left=200,top=200,width=1024,height=700,scrollbars=1,status=1");if(surveywin){
if(!(window.navigator.userAgent.indexOf("Netscape")>0&&window.navigator.userAgent.indexOf("MSIE")>0)){surveywin.blur();}
surveywin.openerWinLocation=window.top.location.href;}}else{window.open(Replace(window.location.href,"surveyinvite.aspx","survey.aspx"));}}else if(surveyDiv!=null&&action=="cancel"){addEventHandler(window,"unload",function(){try{document.open("text/html","replace");surveyDiv.removeChild(surveyDiv.firstChild);}catch(e){}});}else{delayHalfSecond(1500);}}function setKBVisited(){var count=0;for(var i=0;i<survey.kbvisited.length;i++){if(survey.kbvisited.charAt(i)=='|')
count++;}if(count>=survey.maxKBsInCookie){var index=survey.kbvisited.indexOf("|",1);survey.kbvisited=survey.kbvisited.substring(index);}survey.kbvisited=survey.kbvisited+"|"+kbSurvey.submitFields["SURVEYSCID"].replace(/;/g,":")+"@"+g_currentContent;srchSetCookieVal("kbvisited",survey.kbvisited);}this.submit=function(survey,action){if(isOnUnloadSurvey&&isTracking){setDomainIsTracking(false);isTracking=false;}if(survey.submitted){return;}survey.submitted=true;if(survey.isInvitation){handleInvitationSubmit(survey,action);}else{postback(survey,action);}};survey.submitHandler=this.submit;var surveyStyle=survey.surveyStyle;var openerWin=null;var openerUrl=null;var isOnUnloadSurvey=survey.isOnUnloadSurvey ? true : false;var urlHashCleaner = /#.*$/;var isTracking=false;var triggerContains=survey.surveyTriggerContains;var trackingText=survey.surveyTrackingText;var triggerPages=survey.surveyTriggerPages;var isKBEmbedded=survey.isKBEmbedded ? true : false;function hyperLinkOnClick(e){if(e=='undefined'){e=window.event;}var a=e.srcElement ? e.srcElement : e.target;while(a&&a.tagName&&a.tagName.toLowerCase()!="a"){a=a.parentNode;}if(a&&a.href!=null){if(a.href.toLowerCase().indexOf("javascript:")<0){a.target="_blank";}else{return false;}}}function handleKeypress(e){if(isTracking){return;}if(typeof(e)=='undefined'){return;}if(e.keyCode==27&&surveyStyle=="embedded"){survey.cancel();if(e.preventDefault){e.preventDefault();}else{e.returnValue=false;}}if(e.keyCode==13){var source=e.srcElement ? e.srcElement : e.target;if(source==null||(source.tagName.toUpperCase()!="A"&&source.type!="textarea"&&source.type!="button")){if((survey.thankyou!=null&&survey.getCurrentPage()==survey.thankyou&&survey.thankyou.isVisible())||survey.isShowAll){window.top.close();}else{survey.next();}if(e.preventDefault){e.preventDefault();}else{e.returnValue=false;}}}}function isKBVisited(){survey.kbvisited=fetchCookieVal("kbvisited");if(g_currentContent==null||g_currentContent=="")
return;g_currentContent=g_currentContent.replace(";",":");g_currentContent=g_currentContent.replace(";",":");if(survey.kbvisited==null||survey.kbvisited.charAt(0)!='|')
survey.kbvisited="";var index=survey.kbvisited.indexOf(g_currentContent);return index>=0;}function validateErrorHandler(survey,validateResult){alert(validateResult.errorMessage);}function handleWindowBeforeUnload(){


if(typeof(window.showsurveymutex)!="undefined"&&window.showsurveymutex==true){return;}survey.giveup();}function handleSectionChanged(){if(survey.isStandalone&&window.scrollTo){var documentElement=document.body ? document.body : document.documentElement;if(documentElement.currentStyle&&documentElement.currentStyle.blockDirection=="rtl"){window.scrollTo(documentElement.scrollWidth,0);}else{window.scrollTo(0,0);}}}this.start=function(){if(survey.isStandalone){document.title=survey.name;}if(survey.isShowAll){survey.suppressSubmission=true;survey.displayBranchRules();}if(!isKBEmbedded){addEventHandler(window,"beforeunload",handleWindowBeforeUnload);}if(survey.thankyou!=null&&window.opener==null){var userAgent=navigator.userAgent;if(userAgent.indexOf("compatible")==-1||userAgent.indexOf("MSIE")==-1){var closeButton=Utils.getChildById(survey.thankyou.domObject,"SurveyCloseButton");if(closeButton){closeButton.style.display="none";}}}if(survey.isInvitation){return true;}if((!survey.isShowAll)&&!(window.navigator.userAgent.indexOf("Netscape/8.1")>-1&&window.navigator.userAgent.indexOf("MSIE")>-1)){if(surveyStyle=="full screen"){try{window.moveTo(0,0);window.resizeTo(screen.availWidth,screen.availHeight);}catch(e){
}}else{
if(navigator.userAgent.indexOf("Firefox")<0){if(surveyStyle!=null&&surveyStyle.toLowerCase()=="popup"){try{resizeTo(1024,700);}catch(e){
}}}}}if(isKBEmbedded){if(isKBVisited()){survey.suppressSubmission=true;for(var index=0;index<survey.pages.length;++index){survey.pages[index].hide();}if(survey.thankyou!=null){survey.thankyou.show();}survey.show();return false;}}survey.onAfterNext.add(new Fms.SurveyEventDelegate(null,handleSectionChanged));survey.onAfterSkip.add(new Fms.SurveyEventDelegate(null,handleSectionChanged));survey.onAfterPrevious.add(new Fms.SurveyEventDelegate(null,handleSectionChanged));survey.onValidateError.add(new Fms.SurveyEventDelegate(null,validateErrorHandler));if(survey.isStandalone){addEventHandler(document,"click",hyperLinkOnClick);
addEventHandler(document,"keypress",handleKeypress);if((!survey.isInvitation)&&(!survey.isShowAll)&&isOnUnloadSurvey){




if(window.opener!=null&&(window.history.length==0||(window.navigator.userAgent.indexOf("MSIE")<0&&window.history.length==1))&&(window.location.hash!="#showsurvey")
){try{openerWin=window.opener;if(typeof(window.openerWinLocation)!='undefined'){openerUrl=window.openerWinLocation;}else{openerUrl=openerWin.location.href;}openerUrl=openerUrl.replace(urlHashCleaner,"");var surveyTrackingMsg=document.createElement("DIV");surveyTrackingMsg.id="surveyTrackingMsg";surveyTrackingMsg.className="TRACKINGMSG";surveyTrackingMsg.innerHTML=trackingText;survey.domObject.parentNode.appendChild(surveyTrackingMsg);setDomainIsTracking(true);isTracking=true;startTracking();}catch(e){}}}}if(!isTracking){showHiddenSurvey();return true;}else{return false;}};function showHiddenSurvey(){var surveyTrackingMsg=document.getElementById("surveyTrackingMsg");if(surveyTrackingMsg){surveyTrackingMsg.style.display="none";}if(isOnUnloadSurvey&&window.opener&&(window.history.length==0||(window.navigator.userAgent.indexOf("MSIE")<0&&window.history.length==1))){


window.showsurveymutex=true;
window.location.replace("#showsurvey");window.showsurveymutex=false;}survey.show();window.focus();if(isOnUnloadSurvey&&isTracking){setDomainIsTracking(false);isTracking=false;}}function inTriggerPages(pages,url){for(var i=0;i<pages.length;i++){if(wildcardMatch(url.toUpperCase(),pages[i].replace(urlHashCleaner,"").toUpperCase())){return true;}}return false;}function getRelativePath(url){var start=url.indexOf('//');var relativest1=url.indexOf('/',start+2);return url.substring(relativest1);}function startTracking(){try{if(openerWin.closed==false){var openerLocation=openerWin.location.href.replace(urlHashCleaner,"");var pathName=getRelativePath(openerLocation);if(openerLocation==openerUrl||inTriggerPages(triggerPages,pathName)||triggerContains.toLowerCase()=="domain"||triggerContains.toLowerCase()=="sub-domain"){window.setTimeout(startTracking,2000);return;}}}catch(e){}if(triggerContains.toLowerCase()=="domain"||triggerContains.toLowerCase()=="sub-domain"){var lastbeat=getLastHeartBeat();var now=new Date().getTime();if(now-lastbeat<3000){window.setTimeout(startTracking,2000);return;}}showHiddenSurvey();survey.start();}function Replace(strOrig,str1,str2){if(strOrig.length==0||str1.length==0)
return strOrig;var index=0;var indexend=0;var len1=str1.length;var result="";do{indexend=strOrig.indexOf(str1,index);if(indexend==-1){indexend=strOrig.length;}result+=strOrig.substring(index,indexend);if(indexend!=strOrig.length)
result+=str2;index=indexend+len1;if(index>=strOrig.length)
break;}while(true);return result;}
function wildcardMatch(source,pattern){if(source==pattern){return true;}if(pattern.length>0){if(source==pattern){return true;}if(pattern.length>0){var body=pattern.trimEnd("*");if(pattern.charAt(pattern.length-1)=='*'&&source.indexOf(body)==0){return true;}}}return false;}String.prototype.trimEnd=function(ch){var body=this;if(body.length){while(body.length>0&&body.charAt(body.length-1)==ch){body=body.substr(0,body.length-1);}}return body;};function getLastHeartBeat(){var entry=fetchCookieVal("fmshb");if(entry){try{return entry.split(',')[1];}catch(e){return null;}}return null;}function isDomainTracking(){var entry=fetchCookieVal("fmshb");if(entry){try{return entry.split(',')[0]=="1" ? true : false;}catch(e){}}return false;}function setDomainIsTracking(value){if(isDomainTracking()!=value){var flag=value ? '1' : '0';document.cookie="fmshb="+flag+","+(new Date().getTime())+";path=/";}}var addEventHandler,removeEventHandler;if(window.attachEvent){addEventHandler=function(e,strEvent,funcPtr){return e.attachEvent("on"+strEvent,funcPtr);};}else if(window.addEventListener){addEventHandler=function(e,strEvent,funcPtr){return e.addEventListener(strEvent,funcPtr,false);};}else{addEventHandler=function(){};}if(window.detachEvent){removeEventHandler=function(e,strEvent,funcPtr){return e.detachEvent("on"+strEvent,funcPtr);};}else if(window.removeEventListener){removeEventHandler=function(e,strEvent,funcPtr){return e.removeEventListener(strEvent,funcPtr,false);};}else{removeEventHandler=function(){};}function delayHalfSecond(delay){try{if(!delay)delay=500;var today=new Date();var now=today.getTime();while(1){var today2=new Date();var now2=today2.getTime();if((now2 - now)>delay){break;};}}catch(e){}}function fetchCookieVal(key){var cookiename;var cookieval;var keyfound=false;var cookiearray=document.cookie.split(';');for(var i=0;i<cookiearray.length;i++){cookiename=cookiearray[i].substring(0,cookiearray[i].indexOf('='));if(cookiename.charAt(0)==' ')cookiename=cookiename.substring(1,cookiename.length);cookieval=cookiearray[i].substring(cookiearray[i].indexOf('=')+1,cookiearray[i].length);if(key==cookiename){keyfound=true;break;}}if(keyfound){return cookieval;}else{return 'blank';}}function setCookieVal(key,val){var d=new Date();d.setFullYear(d.getFullYear()+1);var localdomain=document.domain;if((typeof(gCookieDomain)!='undefined')&&(gCookieDomain!=null)&&(gCookieDomain!='')){localdomain=gCookieDomain;}if(localdomain.indexOf(".com")>-1){document.cookie=key+'='+val+'; expires='+d.toGMTString()+'; Domain='+localdomain+'; path=/';}else{document.cookie=key+'='+val+'; expires='+d.toGMTString()+'; path=/';}}function srchSetCookieVal(key,val){var localdomain=document.domain;if((typeof(gCookieDomain)!='undefined')&&(gCookieDomain!=null)&&(gCookieDomain!='')){localdomain=gCookieDomain;}if(localdomain.indexOf('.com')>-1){document.cookie=key+'='+val+'; Domain='+localdomain+'; path=/';}else{document.cookie=key+'='+val+'; path=/';}}function unicodeFixup(s){var result=new String();var c='';var i=-1;var l=s.length;result='';for(i=0;i<l;i++){c=s.substring(i,i+1);if(c=='%'){result+=c;i++;c=s.substring(i,i+1);if(c!='u'){if(parseInt('0x'+s.substring(i,i+2))>128){result+='u00';}}}
else if(c=='+'){c='%2B';}result+=c;}return result;}};MS.Support.Fms.Gsfx.GsfxSurvey.SurveyStartHandler=function(sender,args){var survey=sender;var gsfxSurvey=new MS.Support.Fms.Gsfx.GsfxSurvey(survey);survey.onBeforeStart.remove(new MS.Support.Fms.SurveyEventDelegate(null,arguments.callee));return gsfxSurvey.start();};if(MS.Support.Fms.Gsfx.DataCollection==null){MS.Support.Fms.Gsfx.DataCollection={};MS.Support.Fms.Gsfx.DataCollection.HandleDataCollectionLinkClick=function(e,defaultErrorMsg){if(!defaultErrorMsg){defaultErrorMsg="Diagnostic Service is currently unavailable. Please try later.";}var cancelDefault=true;if(!MS.Support.Fms.Gsfx.DataCollection.HandleDataCollectionLinkClick.isInProgress){MS.Support.Fms.Gsfx.DataCollection.HandleDataCollectionLinkClick.isInProgress=true;var link=e.srcElement||e.target;var survey=MS.Support.Fms.Survey.GetSurveyInstanceByElement(link);if(survey){var currentQuestion=survey.getCurrentPage().getQuestionByElement(link);}if(currentQuestion&&currentQuestion.clickedLinks&&currentQuestion.clickedLinks["_id"+link.id]){var data=currentQuestion.clickedLinks["_id"+link.id];if(data&&!data.hasError){link.href=data.url;link.target="_blank";cancelDefault=false;}}else{var xml=MS.Support.Fms.Gsfx.DataCollection.RequestManifestInstance();if(xml&&xml.documentElement){var r=xml.documentElement;Utils=MS.Support.Fms.Utils;var fatalError=Utils.findFirstChild(r,function(el){return el.tagName=="fatalError";});if(fatalError){alert(fatalError.text||fatalError.textContent);}else {var guid=Utils.findFirstChild(r,function(el){return el.tagName=="guid";});if(survey&&survey.parameters){survey.parameters[9]=guid.firstChild.nodeValue;}var dcSiteUrl=Utils.findFirstChild(r,function(el){return el.tagName=="url";});var error=Utils.findFirstChild(r,function(el){return el.tagName=="error";});if(currentQuestion){if(!currentQuestion.clickedLinks){currentQuestion.clickedLinks=new Array();}currentQuestion.clickedLinks["_id"+link.id]={"url": dcSiteUrl.firstChild.nodeValue,"hasError":(error ? true : false)};}if(error){var errorDiv=document.createElement("div");errorDiv.className="ErrorMsgBlock";for(var i=0;i<error.childNodes.length;++i){if(error.childNodes[i].xml){errorDiv.innerHTML+=error.childNodes[i].xml;}else {errorDiv.appendChild(error.childNodes[i].cloneNode(true));}}
errorDiv.innerHTML=errorDiv.innerHTML;var errorBlockParent=link.parentNode.parentNode;var errorBlockNext=link.parentNode.nextSibling;if(currentQuestion){errorBlockParent=currentQuestion.domObject;errorBlockNext=null;for(var i=0;i<currentQuestion.domObject.childNodes.length;++i){if(Utils.isAncestorOf(currentQuestion.domObject.childNodes[i],link)&&currentQuestion.domObject.childNodes[i].type!="hidden"){errorBlockNext=currentQuestion.domObject.childNodes[i].nextSibling;}}}errorBlockParent.insertBefore(errorDiv,errorBlockNext);}else {link.href=dcSiteUrl.firstChild.nodeValue;link.target="_blank";cancelDefault=false;}}}else{alert(defaultErrorMsg);}}MS.Support.Fms.Gsfx.DataCollection.HandleDataCollectionLinkClick.isInProgress=false;}if(cancelDefault){if(e.preventDefault){e.preventDefault();}else{e.returnValue=false;}}};MS.Support.Fms.Gsfx.DataCollection.RequestManifestInstance=function(){var serviceHelperUrl=window.location.protocol+"//"+window.location.hostname+(window.location.port ?(":"+window.location.port): "")+"/common/SDPWSWrapper.ashx";if(!window.XMLHttpRequest){window.XMLHttpRequest=function(){return new ActiveXObject("Microsoft.XMLHTTP");};}var xmlHttpRequest=new XMLHttpRequest();xmlHttpRequest.open("GET",serviceHelperUrl,false);xmlHttpRequest.send("");return xmlHttpRequest.responseXML;};}}if(typeof(kbSurvey)!="undefined"){kbSurvey.onBeforeStart.add(new MS.Support.Fms.SurveyEventDelegate(null,MS.Support.Fms.Gsfx.GsfxSurvey.SurveyStartHandler));kbSurvey.start();}