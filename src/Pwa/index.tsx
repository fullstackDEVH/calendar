import { useEffect, useState } from "react";

export default function Pwa() {
  const [isShowButton, setIsShowButton] = useState(false);
  const [promise, setPromise] = useState<any>(null);
  const [count, setCount] = useState(1);
  useEffect(() => {
    const promie = (e: any) => {
      e.preventDefault();
      setPromise(e);
      setIsShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", promie);

    return () => {
      window.removeEventListener("beforeinstallprompt", promie);
    };
  }, []);

  const btnClick = async () => {
    promise.prompt();
    const { outcome } = await promise.userChoice;

    setPromise(null);
    if (outcome === "accepted") {
      alert("User accepted the install prompt.");
    } else if (outcome === "dismissed") {
      alert("User dismissed the install prompt");
      setIsShowButton(false);
    }
  };

  const updateBadge = () => {
    setCount((pre) => pre + 1);
    navigator.setAppBadge(count);
  };

  const clearBadge = () => {
    navigator.clearAppBadge();
    setCount(1);
  };

  const requestNotifications = () => {
    Notification.requestPermission().then((result) => {
      console.log(result);

      if (result === "granted") {
        console.log("granted");

        pushNotifications()
      }
    });
  };

  const pushNotifications = () => {
    const notifTitle = "notification name";
    const notifBody = `Created by .`;
    const notifImg = `https://th.bing.com/th/id/OIP.UIErdwcve31y6aSkuyAvKAHaKX?w=203&h=284&c=7&r=0&o=5&pid=1.7`;
    const options = {
      body: notifBody,
      icon: notifImg,
    };
    new Notification(notifTitle, options);
    console.log("pushNotifications");
    
    setTimeout(pushNotifications, 15000);
  };

  return (
    <div>
      {" "}
      hello{" "}
      {isShowButton ? (
        <button id="installInstructions" onClick={btnClick}>
          click
        </button>
      ) : null}
      <button onClick={updateBadge}>updateBadge</button>
      <button onClick={clearBadge}>clearBadge</button>
      <button onClick={requestNotifications}>requestNotifications</button>
      <button onClick={pushNotifications}>pushNotifications</button>
    </div>
  );
}
