import { addClass, removeClass } from "../../utils/setClass.js";

// 获取父页面传递来的数据
window.addEventListener("message", function (e) {
  // 结构出想要的数据
  const { data } = e;
  if (data == "green") {
    removeClass("theme-dark");
  } else if (data == "dark") {
    addClass(".newMusic", "theme-dark");
  }
});