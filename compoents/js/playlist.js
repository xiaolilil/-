import { addClass, removeClass } from "../../utils/setClass.js";

// 获取父页面传递来的数据
window.addEventListener("message", function (e) {
  // 结构出想要的数据
  const { data } = e;
  if (data == "green") {
    removeClass("dark-name");
    removeClass("dark-h3");
  } else if (data == "dark") {
    addClass(".name", "dark-name");
    addClass("h3", "dark-h3");
  }
});