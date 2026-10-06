import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">This page does not exist</h1>
      <p className="mt-3 text-muted-foreground">
        Check the address, or search the documentation and metric reference.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/docs">Open documentation</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Go to home
        </ButtonLink>
      </div>
    </div>
  );
}
