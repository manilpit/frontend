'use strict';
this.mmooc = this.mmooc || {};

this.mmooc.multilanguage = (function() {

    uioMakeSpans = function  (element){
        //Split the elements content with '|', then check each segment for language code and make <span>-elements.
        let splitArray = element.textContent.trim().split("|");
        let newContent = '';
        for (let i=0; i<splitArray.length; i++){
                let match = /^(\w\w):(.*)/.exec(splitArray[i]); //match language codes formed with two letters and a colon (no:, en: etc)
                if (match){
                        newContent += `<span class="language" lang="${match[1]}">${match[2]}</span>`;
                }else{
                        newContent += splitArray[i];
                }
        }
        return newContent; //HTML-string with span-tags
    }
    getLanguageCode = function(urlParamsObj) {
        const langCode = urlParamsObj && urlParamsObj['lang'];
        if (langCode !== undefined) {
            return urlParamsObj['lang'];
        }
        return null;    
    }
    return {
        init: function() {
            if (location.pathname.endsWith('/edit')){
                    //fix editor
                    function uioTwoLangEditor(){
                            if (typeof(tinymce)!='undefined'){
                                    let iframe = document.getElementById('wiki_page_body_ifr');
                                    let doc = iframe.contentWindow.document;
                                    let editorcss = doc.createElement('style');
                                    editorcss.innerHTML = `
                                            .language:lang(se) {
                                            background-color: LIGHTCYAN;
                                            }
                                            .language:lang(nb) {
                                            background-color: MISTYROSE;
                                            }
                                    `;
                                    doc.head.appendChild(editorcss);
                            }else{
                                    setTimeout(uioTwoLangEditor,500);
                            }
                    }
                    uioTwoLangEditor();
            }else{
                    //fix page
                    let uioDefaultLang = {'nb':'','se':''}; //used to set default value in select box.
                    let uioCssLang = {'nb':'.language:lang(se) {display:none}; .language:lang(nb) {display:content};', 'se':'.language:lang(nb) {display:none}; .language:lang(se) {display:content};'} //used to set css based on language
                    let uionewcss = document.createElement('style');

                    const urlParamsObj = mmooc.utilRoot.urlParamsToObject();
                    let langCode = getLanguageCode(urlParamsObj);
                    if(langCode) {
                        uionewcss.innerHTML = uioCssLang[langCode];
                    } else if (document.cookie.split(';').some((item) => item.trim().startsWith('courselanguage='))) {
                            //language is set in cookie
                            let cookielanguage = document.cookie.replace(/(?:(?:^|.*;\s*)courselanguage\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                            uionewcss.innerHTML = uioCssLang[cookielanguage];
                            uioDefaultLang[cookielanguage] = ' selected';
                    }else{
                       //language is not set in cookie - default=norsk
                        uionewcss.innerHTML = uioCssLang.nb;
                    }
                    document.head.appendChild(uionewcss);

                    let selector = document.createElement('select');
                    document.querySelector('div.ic-app-nav-toggle-and-crumbs').appendChild(selector);
                    let imagedata = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAHQ0lEQVRYw52X+1dT2RXHP/fmQcJwgchIHrwDFdRRKyIgKmN5+ENXR6d2nNda0zXttP9Vu7rGR6faOj6mHZnpCOqoPBRFZQSSQCCBICSSkCeJSW5/yHglJir2/nTXPnufs88+3/3dewuyLMu84SfLMuFwhHh8DVkGrVaDJEmIovimW6HeqOLq6ioOxzQzM05m51yk02nlQFmWkWWZigoLVmsd9dY6jEbjhvYVXhcBn8/H4OAwE5NTCIKw4QhVVVWyv6Od6urq/8+BVCrF4OAwg0PDGzpUFAXSaTnHke3bttLd/St0Ot3GHYjFYpy/cJGFhUVFptfraN3bQjyRYGhohE2bDBQXFxONRolEIsTjCXp7upBlmZGRO6z4/YptcbHE8Q+OsWnTptc7EI1GOXP2HD6fL6MgCHTsa6elpRm/38/JU1+xc8c7dHUd4sHDcUKhEO1trVy69G8WPB7+8PnvkSSJiYlJfrgyQCKRAECn0/HpJx9SVlaWHbkXw37hwjfK4QDHjx+jo6MdtVrN5b7/UlNdRW9vN2r1c/wWFBRw9Oh7SJJEf/9VRFFk+/ZtHHnv14rO2toaZ8+eIxKJvNyBmzcHWfB4ACgsLESSJG7eHCQQWMXpnMXn89HT050XjFqtlsO93dgd0zx+vITNbufipf/Q1NSI2WwCIByJ0Nf3PeuDrlxj2etlaHgEQRAQBIHfHXsfSZK43Pcdf/nr35CKiti+fSsGQ+lLgVhVVYXJWM6ZM/8k8fQpnZ0HaN3bQjQa5csvTxGJRplxzjI1ZaOpqTEbA+fPX8QxPQPAwYP7aW9rVZA8NnafH64MIMsy1rpaamtrKS0twemcJRqN0tTUiO/JE2w2O16vD0EQ+OyzTzGt4wKn08m/zl1QQPnnP/0RURQzEVhZWcHumEYQBPR6Hc27f/kcpYKAvlCPXq/n2G+PMDfnwjk7i8fjIR7PAGx+wUNVZQW7du3EbDJx4uRpeCG56urqqK6uwuVyEwyGmJlx0tBQn3HA4ZhR3rV1bwtarTbL2ONZpLa2GovFgsViUeT37o0RCoXp7DyQpW82m1haWsZkMmXJ21pbcLncANhsdhoa6jMgdExPK0r19dact130PMZYXp7LeIBMLo+ZzSa8Xm+OvLKyEpVKBcDk1FSGzlOpNG73vILkfGThDwSQJGnDBcZgMLDiD+QWHrWa2toaAJLJFH6/HzEcDinhr6iw5KRYMpkkkUhQJBXlp9I8Mr1ORzAYzKtvMpUr2AoGQ6gTiafKocvLy3z99YUsg3Q6TSqVov/KAAUv8HlwNUhaTuPzPcmSh0JhgsFQzl7PovnsSyQSqNdfuKysjObm3VkGT5NPmZ1zsWPHOxgMhqw1m91BLBZl186dWXL3/DyhcChnr2fgW1nxKymu1mq1yLKMIAio1SrljdY/gUolYjQasVjMWWsrfj+hkDbHJhKNoNPpc+SZjPIo/xqNBrGo6PnbehYWebE4qtVqNBptDoe/6ouvxZGkt/KuLa/LjpKSYkRRFKmursoUjHgcfx70lpaWEAqFNuxAYHUVQ6khR55MJpmZmVVAaDAYMjxQb61TlGaczlzkGo1411VIfyDA3JwL77KXgD+Ax7NILBZT1peWlnl789s5+8wvLJBKpQBoatqCSqXKMGFDQz39A9cRRYGRkdvs2rkDjUajGFosZq5dv8HVq9d4OP6IWCyGLMuIoogsy0xO2RAEAZPJyNatTXg8i3QePJDjwJ3bo8p/45ZfPK+GBoOBxsYG7PZpIpEo9+8/oKVlz8/NaBCbzU44HGZpaZnurkOYTEZKSkoyDUkwRFvbXlZW/MzPzzM6eo90Oo3L7cZkMirMNzs3h3N2DgBJKsJqtWaX4/0d+7DZHAiCwLXrN6ipqSEYXOXSN99iNpswlJZSUWFh27atWT2fjExBQQFms0mpAYFAgLt3x3A4pjl65Deo1Rouf/udYtfZeVBxTHFg8+bNtLe3Mjx8m3Q6zT/OnGVtLc67nQdoadnD+PhP9A9cY8+eZvR6/Us76EcTk3z04QeUl2+mr+97Tp3+CkmSCK/LorcKC/N3RPs79lFRYfm5hYpTUFCA1VqHKIo0NTWiVqu5/uONl7biV/qvYjGbqK6uQq/X09PTxVo8zuPHS1m64+M/5XdApVLx/tEjlJVlClI8HufEyb8zOnoXURQ5fLib+/cfcmf0bp7DB3C75+nt7QHAbndw4uRpUslUjrOPJiYVXtlwWy5JRbS3teJyuZmy2Wls3IJWqyEcCpNKpXC553m38yDFxUWM3B5laWn5lVzR3XWI5ubdrx5Mbt0aYmh4ZMMEJAhCFpM+o/i8Jbu0lC+++Hxjo9mtW0NKrr/paFZeXo7NZufBw3E8nsWsPT75+PjrHVg/nNrsDpwzTmZdblh3O1mWSafTVFZWYK2rpb7emnc49Xq9TExOMTb2gFgsxscfvYED2T2CTDgcUqYejebNxvNkMkk0GqO4WOJ/IH5phyyM93kAAAAASUVORK5CYII=";
                    selector.outerHTML = `<span><image src='${imagedata}' style='margin-right: 10px; vertical-align: middle;'> <select id="language-selector"><option value="nb"${uioDefaultLang.nb}>Norsk</option><option value="se"${uioDefaultLang.se}>Nordsamisk</option></select></span>`;
                    document.getElementById('language-selector').onchange = function(e){
                            uionewcss.innerHTML = uioCssLang[e.target.value];
                            document.cookie = 'courselanguage='+e.target.value;
                    }
                    function uiofixpage(){
                            let pagetitle = document.querySelector('h1.page-title');
                            if (pagetitle){
                            pagetitle.innerHTML = uioMakeSpans(pagetitle);
                            let breadcrumbs = document.querySelectorAll('#breadcrumbs li span');
                            for (let i=0; i<breadcrumbs.length; i++){
                                breadcrumbs[i].innerHTML = uioMakeSpans(breadcrumbs[i]);
                            }
                            }
                            else setTimeout(uiofixpage,200);
                    }
                    if (location.pathname.endsWith('/modules')){
                            let linktitles = document.querySelectorAll('a.title');
                            for (let i=0; i<linktitles.length; i++){
                                    linktitles[i].innerHTML = uioMakeSpans(linktitles[i]);
                            }
                            let modulenames = document.querySelectorAll('span.name');
                            for (let i=0; i<modulenames.length; i++){
                                    modulenames[i].innerHTML = uioMakeSpans(modulenames[i]);
                            }
                            let subtitlenames = document.querySelectorAll('span.title');
                            for (let i=0; i<subtitlenames.length; i++){
                                    subtitlenames[i].innerHTML = uioMakeSpans(subtitlenames[i]);
                            }
                    }else{
                            uiofixpage();
                    }
            } //end if
        } //end init
    } // end return
})();    