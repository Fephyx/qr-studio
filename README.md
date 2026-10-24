# QR Studio

A modern, responsive QR code generator built with **Next.js**, **React**, and **TypeScript**. Create QR codes for website links, Wi-Fi networks, and Czech bank payments, then download the result as an SVG file.

## Features

- **Website QR codes** — turn a URL into a scannable QR code.
- **Wi-Fi QR codes** — encode a network name and supported security settings so compatible devices can connect by scanning.
- **Czech payment QR codes** — generate a QR payment payload using the SPD 1.0 format, with IBAN, amount in CZK, optional variable symbol, and optional message.
- **Live preview** — the QR code updates as you fill in the form.
- **SVG download** — export a generated QR code for sharing or printing.
- **Responsive interface** — works on desktop, tablet, and mobile screens.
- **Runs in the browser** — the app builds the QR payload locally; no application-specific backend is required for the generator itself.

## Tech stack

- [Next.js](https://nextjs.org/) — React framework
- [React](https://react.dev/) — user interface
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [qrcode.react](https://www.npmjs.com/package/qrcode.react) — QR code rendering
- [Boxicons](https://boxicons.com/) — icons
- Custom CSS — layout, styling, responsive behavior, and animations

## Getting started

### Requirements

- Node.js (use a current LTS release)
- npm (included with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Fephyx/qr-studio.git
   cd qr-studio
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

To create a production build, run:

```bash
npm run build
npm start
```

## How to use it

1. Choose **Website link**, **Wi-Fi access**, or **Bank payment**.
2. Enter the required information. The preview updates automatically when the data is valid.
3. Check the displayed details before sharing the code.
4. Select **Download QR as SVG** to save the generated code.

### Payment QR notes

- The payment QR uses the Czech SPD 1.0 format and encodes the amount in CZK.
- Verify the recipient's IBAN, amount, variable symbol, and message before sharing the QR code.
- A payment QR only prepares payment details. It does **not** transfer money by itself.

### Wi-Fi QR notes

The exact security options depend on the values configured in the `CustomSelect` component. Devices must support scanning Wi-Fi QR codes to use them for joining a network.

## Project structure

The main files used by the app include:

```text
qr-studio/
├── app/
│   └── page.tsx          # Main QR Studio interface
├── components/
│   └── CustomSelect.tsx  # Custom security-type selector
├── css/
│   └── globals.css       # Global styles and responsive layout
├── public/               # Static assets (if used)
├── package.json
└── README.md
```

Your local folder structure may differ slightly depending on how the Next.js project was created.

## Deployment

QR Studio can be deployed to a Next.js-compatible hosting provider, such as [Vercel](https://vercel.com/).

1. Import the `Fephyx/qr-studio` repository into your hosting provider.
2. Keep the default Next.js build settings unless your project requires otherwise.
3. Deploy the project and open the generated URL to test all three QR modes.

## Privacy

The QR payload is generated in the browser by the app. Treat the resulting QR code as public information once you share or publish it. In particular, a Wi-Fi QR code can reveal network access details, and a payment QR contains the payment information entered into the form.

## License

No license has been specified yet. Unless a license is added to this repository, others should not assume that the source code is licensed for reuse.
