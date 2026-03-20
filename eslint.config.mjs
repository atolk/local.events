import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Global import hygiene for all source files.
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*", "../../*", "../../../*", "../../../../*"],
              message:
                'Use "@/..." alias instead of parent-relative imports.',
            },
          ],
        },
      ],
    },
  },

  // Architecture boundaries: lib is the lowest layer.
  {
    files: ["src/lib/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/app/**",
                "@/components/**",
                "@/data/**",
                "@/hooks/**",
                "@/public/**",
                "@/stores/**",
              ],
              message: "`src/lib` can depend only on `src/lib`.",
            },
          ],
        },
      ],
    },
  },

  // Hooks can depend only on low-level layers (`lib`, `stores`).
  {
    files: ["src/hooks/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**", "@/components/**", "@/data/**", "@/public/**", "@/lib/dal/**"],
              message: "`src/hooks` can depend only on `src/lib` and `src/stores`.",
            },
          ],
        },
      ],
    },
  },

  // UI primitives must stay framework-agnostic and business-logic free.
  {
    files: ["src/components/ui/primitives/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/app/**",
                "@/components/features/**",
                "@/components/ui/composites/**",
                "@/data/**",
                "@/hooks/**",
                "@/lib/**",
                "@/public/**",
                "@/stores/**",
              ],
              message:
                "`ui/primitives` can depend only on `ui/primitives`.",
            },
          ],
        },
      ],
    },
  },

  // UI composites can compose primitives but not business/domain layers.
  {
    files: ["src/components/ui/composites/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/app/**",
                "@/components/features/**",
                "@/data/**",
                "@/hooks/**",
                "@/lib/**",
                "@/public/**",
                "@/stores/**",
              ],
              message:
                "`ui/composites` can depend only on `ui/primitives` and `ui/composites`.",
            },
          ],
        },
      ],
    },
  },

  // Feature components are allowed to use shared UI and domain layers.
  {
    files: ["src/components/features/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**", "@/public/**"],
              message:
                "`features` must not import route-layer (`app`) or `public` modules.",
            },
          ],
        },
      ],
    },
  },

  // Data layer must stay independent from route/component layers.
  {
    files: ["src/data/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**", "@/components/**"],
              message: "`src/data` must not import app/component layers.",
            },
          ],
        },
      ],
    },
  },

  // Stores can depend only on domain layer (`lib`).
  {
    files: ["src/stores/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/app/**",
                "@/components/**",
                "@/data/**",
                "@/hooks/**",
                "@/lib/dal/**",
                "@/public/**",
                "@/stores/**",
              ],
              message: "`src/stores` can depend only on `src/lib`.",
            },
          ],
        },
      ],
    },
  },

  // `app` is route layer; nobody outside it can import from it.
  {
    files: [
      "src/components/**/*.{ts,tsx,js,jsx}",
      "src/data/**/*.{ts,tsx,js,jsx}",
      "src/hooks/**/*.{ts,tsx,js,jsx}",
      "src/lib/**/*.{ts,tsx,js,jsx}",
      "src/public/**/*.{ts,tsx,js,jsx}",
      "src/stores/**/*.{ts,tsx,js,jsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**", "@/lib/dal/**"],
              message:
                "Only `src/app` can import from `src/app`; use `/api/events` from client code instead of importing the DAL directly.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["src/**/*.{test,spec}.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];

export default eslintConfig;
