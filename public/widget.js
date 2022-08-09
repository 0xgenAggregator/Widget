(function () {
  const baseUrl = "https://app.0xgen.io";
  const html = `
    <div class="widget-wrapper">
    <div class="widget-launcher fold" id="widget_launcher">
        <svg
        id="logo"
        viewBox="0 0 60 60"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        >
        <g
            id="Page-1"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
        >
            <g id="1" fill-rule="nonzero">
            <path
                d="M45.8994125,30.2371212 C45.7477852,38.8190923 38.8190923,45.7477853 30.2371212,45.8994125 L30.2375262,39.1770446 C35.1073189,39.0279096 39.0279095,35.1073189 39.1770446,30.2375262 L45.8994125,30.2371212 Z M14,30.2371212 L20.7223679,30.2375262 C20.8650788,34.8975445 24.46132,38.6883763 29.0380727,39.1370026 L29.0380727,45.8763294 C20.7466673,45.4091264 14.1479324,38.6099666 14,30.2371212 Z M29.0380727,14.0230831 L29.0380727,20.76241 C24.6673462,21.1908409 21.190841,24.6673462 20.76241,29.0380726 L14.0230831,29.0380726 C14.478617,20.9537554 20.9537554,14.478617 29.0380727,14.0230831 Z M30.2371212,14 C37.5034959,14.1283832 43.5846276,19.1152772 45.3703519,25.8505178 L38.2236174,25.8502937 C36.7537754,22.8893818 33.7413424,20.8296706 30.2375262,20.7223679 L30.2371212,14 Z"
                fill="#FFFFFF"
            ></path>
            <path
                d="M35.9370912,28.7961729 L45.9882993,28.7961729 C46.0214602,29.8394002 45.9841351,30.7507091 45.8763239,31.5300996 C45.7685127,32.3094901 45.6069523,33.1123468 45.3916425,33.93867 L31.3782073,33.93867 L35.9370912,28.7961729 Z"
                fill="#FFFFFF"
            ></path>
            <polygon
                fill="url(#linearGradient-nnkkpk1fyz-1)"
                points="29.1145168 28.7961729 34.4538691 28.7961729 29.867181 33.93867 24.5278287 33.93867"
            ></polygon>
            </g>
        </g>
        </svg>
        <svg
        id="arrow"
        viewBox="0 0 60 60"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        >
        <g
            id="Page-1"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
        >
            <g id="2" fill-rule="nonzero">
            <polygon
                id="Path"
                fill="#FFFFFF"
                points="23 28.6818874 24.6818874 27 30.5 32.8181126 36.3181126 27 38 28.6818874 30.5 36.1818874"
            ></polygon>
            </g>
        </g>
        </svg>
    </div>
    <div class="widget" id="widget">
        <iframe
        class="widget-iframe"
        src="${baseUrl}"
        id="widget_iframe"
        ></iframe>
        <div class="widget-loading" id="widget_loading">
        <svg
            version="1.1"
            id="L3"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 100 100"
            enable-background="new 0 0 0 0"
            xml:space="preserve"
        >
            <circle
            fill="none"
            stroke="#e1e6f0"
            stroke-width="3"
            cx="50"
            cy="50"
            r="44"
            style="opacity: 0.5"
            ></circle>
            <circle
            fill="var(--color-blue)"
            stroke="#e1e6f0"
            stroke-width="1"
            cx="7"
            cy="55"
            r="6"
            >
            <animateTransform
                attributeName="transform"
                dur="1.5s"
                type="rotate"
                from="0 50 48"
                to="360 50 52"
                repeatCount="indefinite"
            ></animateTransform>
            </circle>
        </svg>
        </div>
    </div>
    </div>`;
  // style
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = `${baseUrl}/widget.css`;
  document.head.appendChild(link);

  // container
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.append(container);
  var launcher = document.getElementById("widget_launcher");
  var widget = document.getElementById("widget");
  var iframe = document.getElementById("widget_iframe");
  var loading = document.getElementById("widget_loading");
  launcher.addEventListener("click", function () {
    if (launcher.className === "widget-launcher fold") {
      launcher.className = "widget-launcher unfold";
      widget.className = "widget show";
    } else {
      launcher.className = "widget-launcher fold";
      widget.className = "widget";
    }
  });
  iframe.addEventListener("load", function () {
    loading.style.display = "none";
  });
})();
