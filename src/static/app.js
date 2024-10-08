

// Tooltip behavior
const tooltipSpan = document.getElementById("details-box");
const element = document.getElementById("INUP");

document.addEventListener("mouseover", function (e) {
  if (e.target.tagName === "path") {
    const content = e.target.getAttribute("name");
    tooltipSpan.innerHTML = content;
    tooltipSpan.style.opacity = "100%";
  } else {
    tooltipSpan.style.opacity = "0%";
  }
});

window.onmousemove = function (e) {
  const x = e.clientX,
    y = e.clientY;
  tooltipSpan.style.top = y + 20 + "px";
  tooltipSpan.style.left = x - 100 + "px";
};

// Hover effect for element with ID "INUP"
element.addEventListener("mouseover", () => {
  element.classList.add("transformed");

  // Remove the 'transformed' class after 1 second (1000ms)
  setTimeout(() => {
    element.classList.remove("transformed");
  }, 1000);
});
