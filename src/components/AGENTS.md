# UI Components

## Primitives & Composites (shadcn)

- To add a primitive: `npx shadcn@latest add <component> --path src/components/ui/primitives`.
- To add a composite: `npx shadcn@latest add <component> --path src/components/ui/composites`.
- `components/ui/primitives/`: never create from scratch and do not hand-edit; primitives must come from shadcn CLI.
- Before building a custom composite, first check whether an existing shadcn component can be installed in `components/ui/composites/`.
- `components/ui/composites/`: creating and editing files is allowed.
- Relevant shadcn reference: `https://ui.shadcn.com/llms.txt` (includes component lists and links for navigation to other docs pages).
