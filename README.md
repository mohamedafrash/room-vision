# Room Vision 🏠

A simple tool to reimagine your space. Upload a photo of a room, tell the AI what you want (like "Make it Japandi style"), and see it happen instantly.

## How it works
It's built with **Next.js 16** and **Tailwind 4**. For the AI part, it uses the **Vercel AI SDK** to talk to **Google Gemini 2.5 Flash** through an **AI Gateway**. 

It's multimodal, meaning it actually "looks" at your photo to understand the layout before editing it.

## Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/mohamedafrash/room-vision.git
   cd room-vision
   pnpm install
   ```

2. **Environment**
   Grab your `AI_GATEWAY_API_KEY` and put it in a `.env.local` file:
   ```bash
   AI_GATEWAY_API_KEY=your_key_here
   ```

3. **Run**
   ```bash
   pnpm dev
   ```

## Key bits
- **Drag & Drop:** Just throw a photo in.
- **Before/After:** A slider to see the change.
- **History:** Saves your previous renders in local storage.
- **Tailwind 4:** Playing with the newest CSS features.

Feel free to fork it, mess around with the prompts in `api/generate`, or use it as a starting point for your own AI projects.

## License
MIT. See the [LICENSE](LICENSE) file for details.
