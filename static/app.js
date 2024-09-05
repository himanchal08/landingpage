window.onload = () => {
  const loadingPage = document.getElementById("loading-page");
  const mainContent = document.getElementById("main-content");

  // Lenis smooth scrolling
  const lenis = new Lenis({
    smooth: true,
    duration: 1.5, // Adjust based on preference
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // GSAP timeline for loading screen transition
  const tl = gsap.timeline();

  tl.to("#loading-page", {
    opacity: 0,
    duration: 0.5,
    delay: 3, // Loader stays visible for 3 seconds
    onComplete: () => {
      loadingPage.style.display = "none"; // Hide the loading page
    },
  }).to("#main-content", {
    opacity: 1,
    duration: 0.5,
    display: "block", // Show the main content
    ease: "power1.out",
  });
};

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

