if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js") // ✅ 注意路径：没有 "/"
      .then((reg) => {
        console.log("✅ Service Worker 注册成功", reg);
      })
      .catch((err) => {
        console.error("❌ 注册失败", err);
      });
  });
}
