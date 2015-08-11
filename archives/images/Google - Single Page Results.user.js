// Google - Single Page Results
// version 0.1
// 2008-04-12
// Copyright (c) 2008, Julien Couvreur
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
// --------------------------------------------------------------------
//
// ==UserScript==
// @name            Google - Single Page Results
// @namespace	http://blog.monstuff.com/archives/cat_greasemonkey.html
// @description    Combines the multi-page results on Google.com into single-page view with endless scrolling.
// @include         http://google.com/search?*
// @include         http://www.google.com/search?*
// ==/UserScript==

// make a url with page parameter incremented
function makeNextUrl(baseUrl, pageNumber) {
  var resultsPerPage = 10;

  var nextUrl = baseUrl + "&start=" + (pageNumber * resultsPerPage);
  return nextUrl;
}

// point to the interesting div with the results
function getContent(doc) {
  var xpath = "//div[@id='gm_res'][last()]";
  return getNode(doc, xpath);
}

function cleanIFrame(iframeDoc) 
{
  // give a name to the interesting div in the results
  var firstDiv = getNode(iframeDoc, "//div[@id='res'][last()]/div[1]");

  firstDiv.setAttribute("id", "gm_res");
}


function getNextPage(href, pageNumber, doneCallback) {   
  var loadingHref = makeNextUrl(href, pageNumber);
  GM_log("loading next url: " + loadingHref);

  GM_xmlhttpRequest({
      method: 'GET',
      url: loadingHref,
      onload: function(responseDetails) {
        var iframeOnload = function() {
          var iframeDoc = iframe.contentDocument;
          iframeDoc.getElementsByTagName("body")[0].innerHTML = responseDetails.responseText;
	            
          injectContent(iframeDoc);
          doneCallback();            
       };
       
       var iframe = createIframe(iframeOnload);
     }
  });
}


function createIframe(onload) {
    var iframe = document.createElement("iframe");
    iframe.addEventListener("load", onload, false);
    iframe.src = "about:blank";
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    //iframe.style.width = '1000px';
    //iframe.style.height = '100px';
    
    iframe.style.border = '0px';    
    document.getElementsByTagName('body')[0].appendChild(iframe);
    return iframe;
}


function monitorScrolling(){
  var isUpdating = false;
  var currentPage = 1;
  var checkInterval = 100; // how frequently to check the scroll status
  var preloadDistance = 200; // how far from the bottom of the page should we start pre-loading the next page
  var isUpdating = false;
  var timer;
  var spinner;

  var check = function() {
    //GM_log("checking for scroll status: " + scrollPosFromBottom());

    if ( isUpdating == false
               && scrollPosFromBottom() < preloadDistance)
    {
      isUpdating = true;
      showLoading();
      currentPage++;
      getNextPage(document.location.href, currentPage, loaded);
    }
  }

  var loaded = function() {
    isUpdating = false;
    hideLoading();
  }

  var startTimer = function() {
    timer = setInterval(check, checkInterval);
  }

  var showLoading = function() {
    spinner = document.createTextNode("Loading...");

    var contentNode = getContent(document);

    var separatorDiv = document.createElement("div");
    separatorDiv.innerHTML = "<hr><b>Page " + (currentPage+1) + "</b>";
    contentNode.appendChild(separatorDiv);

    contentNode.appendChild(spinner);
  }

  var hideLoading = function() {
    spinner.parentNode.removeChild(spinner);
  }

  startTimer();
}


function injectContent(iframeDoc) 
{
    GM_log("processing new content");

    cleanIFrame(iframeDoc);
    
    // Take the interesting part out of the iframe
    // and stick it right after the interesting part in the main document
    
    var dest = getContent(document);
    GM_log("looking for destination: " + dest);
    if (dest != null) 
    {    
        GM_log("found destination content and position");

        var source = getContent(iframeDoc);
        GM_log("looking for source: " + source);

        if (source != null) 
        {
            GM_log("found source content");
            dest.parentNode.insertBefore(source, dest.nextSibling);
        }
    }
}

function getNode(iframeDoc, xpath) {
    GM_log("looking for xpath: " + xpath + " in doc: " + iframeDoc);

    var result = iframeDoc.evaluate(xpath, iframeDoc, null,
                                    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if (result.snapshotLength > 0) {
        return result.snapshotItem(0);
    }

    GM_log("no content found");
    return null;
}


function scrollPosFromBottom() {
  return parseInt(document.body.offsetHeight) - parseInt(self.pageYOffset) - parseInt(self.innerHeight);
}

// ******************************* Main logic ******************************* //

// if this is the first page of an article...
if (document.location.href.match(/\/search\?/) != null &&
   document.location.href.match(/\&start/) == null) 
{
    GM_log("found matching url");

    cleanIFrame(document); // re-organize the result page a little
    monitorScrolling();
}

