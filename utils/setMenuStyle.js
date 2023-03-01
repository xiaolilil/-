import { addClass, removeClass } from "../utils/setClass.js";

export function changeClass(pages, theme = "Green") {
  const lis = $(".item-menu");

  for (let i = 0; i < lis.length; i++) {
    lis[i].onmouseenter = () => {
      addClass(lis[i], `hover${theme}Item`);
    };
    lis[i].onmouseleave = () => {
      removeClass(`hover${theme}Item`);
    };
    lis[i].onclick = () => {
      removeClass(`click${theme}Item`);
      addClass(lis[i], `click${theme}Item`);
      const url = lis[i].className.split(" ")[0];
      console.log("url", url);
      window.parent.postMessage(url, "*");
    };
  }
};

