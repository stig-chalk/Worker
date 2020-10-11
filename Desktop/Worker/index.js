
const socialLinks = [{ "name": "My Github", "url": "https://github.com/stig-chalk/", "icon": "https://simpleicons.org/icons/github.svg" },
			   { "name": "My LinkedIn", "url": "https://www.linkedin.com/in/yuhui-chen-05ab5b182/o", "icon": "https://simpleicons.org/icons/linkedin.svg" },
			   { "name": "My Resume", "url": "https://www.dropbox.com/s/airwi8gtevjgvz8/resume.docx?dl=0", "icon": "https://simpleicons.org/icons/dropbox.svg" }];

const links = [{ "name": "Youtube", "url": "https://www.youtube.com/" },
			{ "name": "Google", "url": "https://www.google.com/" },
			{ "name": "Facebook", "url": "https://www.facebook.com/" }];

addEventListener('fetch', event => {
  	event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
	const params = request.url.split("/");

	if (params[params.length - 1] === "links") {
		return new Response(JSON.stringify(links), {
		headers: { 'content-type': 'application/json' },
  		});
	} 
	const init = {
	    headers: {
	      "content-type": "text/html",
	    },
	  }
	const resp = await fetch("https://static-links-page.signalnerve.workers.dev", init);
	return new HTMLRewriter()
		.on("*:not(#social)", new ElementHandler(links))
		.on("div#social", new ElementHandler(socialLinks)).transform(resp);	
}

class ElementHandler {
	constructor(links) {
    	this.links = links
  	}
	async element(element) {
		console.log(`Incoming element: ${element.tagName}`);
		if (element.tagName === "body") {
			element.removeAttribute("class");
			element.setAttribute("style", "background: linear-gradient(0deg, rgba(33,114,173,1) 0%, rgba(10,2,69,1) 100%);");
		}
		if (element.tagName === "title") {
			element.setInnerContent("Yuhui Chen");
		}
		if (element.getAttribute("id") === "links") {
			for (const link of this.links) {
				element.append(`<a href='${link["url"]}'>${link["name"]}</a>`, { html: true });
			}
		}
		if (element.getAttribute("id") === "social") {
			for (const link of this.links) {
				element.append(`<a href='${link["url"]}'><svg><img src="${link["icon"]}"></svg></a>`, { html: true });
			}
		}
		if (["profile", "social"].includes(element.getAttribute("id"))) {
			element.removeAttribute("style");
		}
		if (element.getAttribute("id") === "avatar") {
			element.setAttribute("src", "https://www.dropbox.com/s/w8o5ep411ts75k0/WechatIMG27.jpeg?dl=1");
		}
		if (element.getAttribute("id") === "name") {
			element.append("Yuhui Chen");
		}
	}
}
