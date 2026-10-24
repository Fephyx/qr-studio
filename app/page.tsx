"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "@/css/globals.css";
import CustomSelect from "@/components/CustomSelect";

type Mode = "link" | "wifi" | "payment";

function escapeWifiValue(value: string) {
  return value.replace(/([\\;,:\"])/g, "\\$1");
}

function cleanIban(value: string) {
  return value.replace(/\s/g, "").toUpperCase();
}

function createPaymentQR(
  iban: string,
  amount: string,
  variableSymbol: string,
  message: string,
) {
  const cleanAccount = cleanIban(iban);
  const parsedAmount = Number(amount);

  if (
    !/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(cleanAccount) ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0 ||
    parsedAmount > 999999999.99
  ) {
    return "";
  }

  if (variableSymbol && !/^\d{1,10}$/.test(variableSymbol)) {
    return "";
  }

  const fields = [
    "SPD*1.0",
    `ACC:${cleanAccount}`,
    `AM:${parsedAmount.toFixed(2)}`,
    "CC:CZK",
  ];

  if (variableSymbol) fields.push(`X-VS:${variableSymbol}`);

  const cleanMessage = message
    .trim()
    .replace(/[\r\n*]/g, " ")
    .slice(0, 60);

  if (cleanMessage) fields.push(`MSG:${cleanMessage}`);

  return fields.join("*");
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("link");

  const [url, setUrl] = useState("");
  const [ssid, setSsid] = useState("");
  const [security, setSecurity] = useState("");
  const [password, setPassword] = useState("");
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const [variableSymbol, setVariableSymbol] = useState("");
  const [message, setMessage] = useState("");

  const qrValue = useMemo(() => {
    if (mode === "link") return url.trim();

    if (mode === "wifi") {
      if (!ssid.trim() || !security || security.startsWith("--")) return "";

      const normalizedSecurity = security.toLowerCase();
      const isWep = normalizedSecurity.includes("wep");
      const isWpa = normalizedSecurity.includes("wpa");
      const isOpen =
        normalizedSecurity.includes("no password") ||
        normalizedSecurity.includes("open") ||
        normalizedSecurity === "nopass";

      if (!isWep && !isWpa && !isOpen) return "";
      if ((isWep || isWpa) && !password) return "";

      const escapedSSID = escapeWifiValue(ssid);
      if (isOpen) return `WIFI:T:nopass;S:${escapedSSID};;`;

      const escapedPassword = escapeWifiValue(password);
      return `WIFI:T:${isWep ? "WEP" : "WPA"};S:${escapedSSID};P:${escapedPassword};;`;
    }

    return createPaymentQR(iban, amount, variableSymbol, message);
  }, [mode, url, ssid, security, password, iban, amount, variableSymbol, message]);

  const infoTitle =
    mode === "link" ? "Destination link" : mode === "wifi" ? "Wi-Fi network" : "Payment details";

  const infoText =
    mode === "link"
      ? url.trim() || "Your destination will appear here"
      : mode === "wifi"
        ? ssid.trim() || "Your network name will appear here"
        : qrValue
          ? `${Number(amount).toFixed(2)} CZK${variableSymbol ? ` · VS ${variableSymbol}` : ""}`
          : "Complete the required payment fields";

  function downloadQRCode() {
    const svg = document.getElementById("generated-qr");
    if (!svg || !qrValue) return;

    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const source = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `qr-${mode}.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }

  function clearCurrentMode() {
    if (mode === "link") setUrl("");
    if (mode === "wifi") {
      setSsid("");
      setSecurity("");
      setPassword("");
    }
    if (mode === "payment") {
      setIban("");
      setAmount("");
      setVariableSymbol("");
      setMessage("");
    }
  }

  return (
    <main className={`app mode-${mode}`}>
      <div className="app-shell">
        <header className="topbar">
          <a className="brand" href="/" aria-label="QR Studio home">
            <span className="brand-symbol"><i className="bx bx-qr" /></span>
            <span className="brand-copy">
              <strong>qr<span>studio</span></strong>
              <small>CREATE · SHARE · CONNECT</small>
            </span>
          </a>

        </header>


        <section className="mode-picker" aria-label="Choose QR code type">
          <button type="button" className={`mode-card ${mode === "link" ? "selected" : ""}`} onClick={() => setMode("link")} aria-pressed={mode === "link"}>
            <span className="mode-icon"><i className="bx bx-link-alt" /></span>
            <span className="mode-card-copy"><strong>Website link</strong><small>Open a page or profile</small></span>
            <span className="mode-arrow"><i className="bx bx-right-arrow-alt" /></span>
          </button>
          <button type="button" className={`mode-card ${mode === "wifi" ? "selected" : ""}`} onClick={() => setMode("wifi")} aria-pressed={mode === "wifi"}>
            <span className="mode-icon"><i className="bx bx-wifi" /></span>
            <span className="mode-card-copy"><strong>Wi-Fi access</strong><small>Connect without typing</small></span>
            <span className="mode-arrow"><i className="bx bx-right-arrow-alt" /></span>
          </button>
          <button type="button" className={`mode-card ${mode === "payment" ? "selected" : ""}`} onClick={() => setMode("payment")} aria-pressed={mode === "payment"}>
            <span className="mode-icon"><i className="bx bx-credit-card-alt" /></span>
            <span className="mode-card-copy"><strong>Bank payment</strong><small>Generate a Czech QR payment</small></span>
            <span className="mode-arrow"><i className="bx bx-right-arrow-alt" /></span>
          </button>
        </section>

        <section className="workspace" aria-label="QR code workspace">
          <div className="editor-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">STEP 01 / DETAILS</span>
                <h2>{mode === "link" ? "LInk QR" : mode === "wifi" ? "Network QR" : "Payment QR"}</h2>
                <p>{mode === "link" ? "Add the destination that should open when someone scans the code." : mode === "wifi" ? "Enter the network details. People can connect by scanning the code." : "Fill in the account and amount to create a Czech payment QR."}</p>
              </div>
              <span className="step-number">01</span>
            </div>

            {mode === "link" && (
              <div className="form-fields link-option">
                <label className="field-label" htmlFor="qr-url">Website URL <span>REQUIRED</span></label>
                <div className="input-wrap input-with-icon">
                  <i className="bx bx-globe" />
                  <input id="qr-url" type="url" className="link-inp" placeholder="https://example.com" value={url} onChange={(event) => setUrl(event.target.value)} autoComplete="url" />
                </div>
                <div className="field-hint"><i className="bx bx-info-circle" /> Include the full address, including https://</div>
              </div>
            )}

            {mode === "wifi" && (
              <div className="form-fields wifi-option">
                <label className="field-label" htmlFor="wifi-ssid">Network name <span>REQUIRED</span></label>
                <div className="input-wrap input-with-icon">
                  <i className="bx bx-wifi" />
                  <input id="wifi-ssid" type="text" className="net-name" placeholder="Your Wi-Fi name" value={ssid} onChange={(event) => setSsid(event.target.value)} autoComplete="off" />
                </div>

                <label className="field-label" htmlFor="wifi-security">Security type <span>REQUIRED</span></label>
                <div id="wifi-security" className="select-wrap"><CustomSelect value={security} onChange={setSecurity} /></div>

                <label className="field-label" htmlFor="wifi-password">Network password <span>{security.toLowerCase().includes("no password") || security.toLowerCase().includes("open") || security.toLowerCase() === "nopass" ? "NOT NEEDED" : "REQUIRED"}</span></label>
                <div className="input-wrap input-with-icon">
                  <i className="bx bx-lock" />
                  <input id="wifi-password" type="password" className="net-name" placeholder="Enter Wi-Fi password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={!security || security.startsWith("--") || security.toLowerCase().includes("no password") || security.toLowerCase().includes("open") || security.toLowerCase() === "nopass"} autoComplete="new-password" />
                </div>
                <div className="field-hint"><i className="bx bx-shield-quarter" /> Your network details are used only to build the QR code.</div>
              </div>
            )}

            {mode === "payment" && (
              <div className="form-fields payment-option">
                <label className="field-label" htmlFor="payment-iban">Recipient IBAN <span>REQUIRED</span></label>
                <div className="input-wrap input-with-icon">
                  <i className="bx bx-landmark" />
                  <input id="payment-iban" type="text" className="net-name" placeholder="CZ65 0800 0000 1920 0014 5399" value={iban} onChange={(event) => setIban(event.target.value)} autoComplete="off" spellCheck={false} />
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label" htmlFor="payment-amount">Amount <span>REQUIRED</span></label>
                    <div className="input-wrap amount-wrap">
                      <input id="payment-amount" type="number" className="net-name" placeholder="499.00" min="0.01" max="999999999.99" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
                      <span className="input-suffix">CZK</span>
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="payment-variable-symbol">Variable symbol <span>OPTIONAL</span></label>
                    <input id="payment-variable-symbol" type="text" className="net-name" placeholder="1234567890" inputMode="numeric" maxLength={10} value={variableSymbol} onChange={(event) => setVariableSymbol(event.target.value.replace(/\D/g, "").slice(0, 10))} />
                  </div>
                </div>

                <label className="field-label" htmlFor="payment-message">Message for recipient <span>OPTIONAL</span></label>
                <div className="input-wrap input-with-icon">
                  <i className="bx bx-message-bubble-reply bx-flip-horizontal" />
                  <input id="payment-message" type="text" className="net-name" placeholder="Payment for order" maxLength={60} value={message} onChange={(event) => setMessage(event.target.value)} />
                </div>

              </div>
            )}

            <div className="editor-footer">
              <button type="button" className="text-button" onClick={clearCurrentMode}><i className="bx bx-eraser" /> Clear fields</button>
            </div>
          </div>

          <aside className="preview-panel">
            <div className="preview-topline">
              <div><span className="panel-kicker">STEP 02 / PREVIEW</span><h2>Your QR code</h2></div>
              <span className={`preview-status ${qrValue ? "is-ready" : ""}`}><span />{qrValue ? "Ready" : "Waiting for input"}</span>
            </div>

            <div className={`qr-stage ${qrValue ? "has-qr" : ""}`}>
              <div className="qr-corner corner-tl" /><div className="qr-corner corner-tr" /><div className="qr-corner corner-bl" /><div className="qr-corner corner-br" />
              {qrValue ? (
                <QRCodeSVG id="generated-qr" className="generated-qr" value={qrValue} size={220} level="M" includeMargin />
              ) : (
                <div className="empty-qr">
                  <div className="empty-qr-icon"><i className="bx bx-qr-scan" /></div>
                  <strong>Your code appears here</strong>
                  <p>{mode === "link" ? "Enter a website address to create your QR code." : mode === "wifi" ? "Add your network name, security type, and password." : "Enter a valid IBAN and amount to prepare a payment QR."}</p>
                </div>
              )}
            </div>

            <div className="destination-card">
              <span className="destination-icon"><i className={`bx ${mode === "link" ? "bx-link-alt" : mode === "wifi" ? "bx-wifi" : "bx-credit-card-alt"}`} /></span>
              <div className="destination-copy"><span>{infoTitle}</span><strong title={infoText}>{infoText}</strong></div>
              <span className={`destination-indicator ${qrValue ? "active" : ""}`}><i className={`bx ${qrValue ? "bx-check" : "bx-minus"}`} /></span>
            </div>

            <button type="button" className="download-button" onClick={downloadQRCode} disabled={!qrValue}>
              <i className="bx bx-download" /> Download QR as SVG <i className="bx bx-arrow-to-bottom download-arrow" />
            </button>

          </aside>
        </section>
      </div>
    </main>
  );
}
