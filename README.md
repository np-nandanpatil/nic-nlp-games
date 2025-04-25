# NIC's ML Nova - Round 1

An interactive website featuring three NLP-related games for ML enthusiasts:
1. Emoji NLP: Guess NLP/ML terms from emoji combinations
2. Categorize That!: Classify short text into categories
3. Word Morph: Transform words one letter at a time

## Features

- User registration with Name, USN, and Mobile Number
- Interactive game interfaces
- Real-time scoring system
- Admin dashboard for tracking participant progress
- Responsive design for all devices

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Heroicons

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/np-nandanpatil/nic-nlp-games.git
cd nic-nlp-games
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.


## Project Structure

```
nic-nlp-games/
├── app/
│   ├── admin/
│   │   └── page.tsx
│   ├── games/
│   │   ├── emoji-nlp/
│   │   │   └── page.tsx
│   │   ├── categorize/
│   │   │   └── page.tsx
│   │   ├── word-morph/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

<!-- Deployment triggered: [timestamp] --> 