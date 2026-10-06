"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/button-link";
import {
  ageFrom,
  MINIMUM_AGE,
  ROLES,
  type RegisterInput,
  type Role,
} from "@/lib/api/account-client";
import { PERSONAL_EMAIL_HINT, personalEmailError } from "@/lib/validation/email";
import { ApiUnconfigured, AuthCard, inputClass } from "./auth-card";
import { useAuth } from "./auth-provider";

const INTENDED_USE_MIN = 20;
const INTENDED_USE_MAX = 500;

/** Latest date of birth that is at least 18 years ago, as yyyy-mm-dd (for the date picker's max). */
function latestAdultBirthDate(today = new Date()): string {
  const d = new Date(today.getFullYear() - MINIMUM_AGE, today.getMonth(), today.getDate());
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type FieldName = keyof RegisterInput | "confirm";
type Errors = Partial<Record<FieldName, string>>;
export type Values = Omit<RegisterInput, "role"> & { role: Role | ""; confirm: string };

const EMPTY: Values = {
  name: "",
  email: "",
  dateOfBirth: "",
  role: "",
  organization: "",
  country: "",
  intendedUse: "",
  password: "",
  confirm: "",
  acceptTerms: false,
};

/** Every field is mandatory. Mirrors the API rules; the API remains the authority. */
export function validateRegistration(v: Values, today = new Date()): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name.";
  const emailError = personalEmailError(v.email);
  if (emailError) e.email = emailError;
  const age = v.dateOfBirth ? ageFrom(v.dateOfBirth, today) : null;
  if (!v.dateOfBirth) e.dateOfBirth = "Enter your date of birth.";
  else if (age === null || age < 0 || age > 125) e.dateOfBirth = "Enter a valid date of birth.";
  else if (age < MINIMUM_AGE)
    e.dateOfBirth = `You must be at least ${MINIMUM_AGE} years old to register.`;
  if (!ROLES.some(([value]) => value === v.role)) e.role = "Choose your role.";
  if (v.organization.trim().length < 2) e.organization = "Enter your organisation.";
  if (v.country.trim().length < 2) e.country = "Enter your country.";
  if (v.intendedUse.trim().length < INTENDED_USE_MIN)
    e.intendedUse = `Describe your intended use in at least ${INTENDED_USE_MIN} characters.`;
  if (v.password.length < 10) e.password = "Use at least 10 characters.";
  if (!v.confirm || v.confirm !== v.password) e.confirm = "The passwords do not match.";
  if (!v.acceptTerms) e.acceptTerms = "You must accept the terms of use.";
  return e;
}

const FIELD_LABEL: Record<FieldName, string> = {
  name: "Full name",
  email: "Personal email",
  dateOfBirth: "Date of birth",
  role: "Role",
  organization: "Organisation",
  country: "Country",
  intendedUse: "How will you use the API?",
  password: "Password",
  confirm: "Confirm password",
  acceptTerms: "Terms",
};

const ORDER: FieldName[] = [
  "name",
  "email",
  "dateOfBirth",
  "role",
  "organization",
  "country",
  "intendedUse",
  "password",
  "confirm",
  "acceptTerms",
];

/** Plain-language list of what still blocks submission, in form order. */
export function missingSummary(errors: Errors, v: Values): string[] {
  return ORDER.filter((k) => errors[k]).map((k) => {
    if (k === "intendedUse" && v.intendedUse.trim()) {
      return `${FIELD_LABEL[k]} needs at least ${INTENDED_USE_MIN} characters (${v.intendedUse.trim().length} so far)`;
    }
    if (k === "acceptTerms") return "Tick the confirmation box";
    return `${FIELD_LABEL[k]}: ${errors[k]}`;
  });
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        <span className="text-danger" aria-hidden>
          {" "}
          *
        </span>
      </label>
      <div className="mt-1.5">{children}</div>
      {/* Hints sit below the control so labels and inputs line up across a row. */}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function RegisterForm() {
  const { status, client, signIn } = useAuth();
  const router = useRouter();
  const id = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const errors = useMemo(() => validateRegistration(values), [values]);
  const valid = Object.keys(errors).length === 0;
  const useLength = values.intendedUse.trim().length;
  // Show a field's error once the user has left it, or immediately for the age rule.
  const shown = (name: FieldName) =>
    touched[name] ||
    (name === "dateOfBirth" && values.dateOfBirth.length === 10) ||
    (name === "email" && /@[^@\s]+\.[a-z]{2,}$/i.test(values.email.trim()))
      ? errors[name]
      : undefined;

  const f = (name: FieldName) => `${id}-${name}`;
  const bind = (name: Exclude<FieldName, "acceptTerms">) => ({
    id: f(name),
    name,
    required: true,
    value: values[name],
    onChange: (e: { target: { value: string } }) =>
      setValues((v) => ({ ...v, [name]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    "aria-required": true,
    "aria-invalid": !!shown(name),
    "aria-describedby": shown(name) ? `${f(name)}-error` : undefined,
    className: inputClass,
  });

  return (
    <AuthCard
      title="Create an account"
      subtitle={`API access is for researchers and practitioners aged ${MINIMUM_AGE} or over. All fields are required.`}
      footer={
        <>
          Already registered?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      {status === "unconfigured" || !client ? (
        <ApiUnconfigured />
      ) : (
        <form
          noValidate
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!valid || busy) return;
            setBusy(true);
            setFormError(null);
            const input: RegisterInput = {
              name: values.name,
              email: values.email.trim(),
              dateOfBirth: values.dateOfBirth,
              role: values.role as Role,
              organization: values.organization,
              country: values.country,
              intendedUse: values.intendedUse,
              password: values.password,
              acceptTerms: values.acceptTerms,
            };
            try {
              await client.register(input);
              await signIn(input.email, input.password);
              router.push("/dashboard");
            } catch (err) {
              setFormError(err instanceof Error ? err.message : "Registration failed.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field id={f("name")} label="Full name" error={shown("name")}>
            <input {...bind("name")} autoComplete="name" maxLength={120} />
          </Field>
          <Field
            id={f("email")}
            label="Personal email"
            hint={PERSONAL_EMAIL_HINT}
            error={shown("email")}
          >
            <input {...bind("email")} type="email" autoComplete="email" />
          </Field>
          <div className="grid items-start gap-4 sm:grid-cols-2">
            <Field
              id={f("dateOfBirth")}
              label="Date of birth"
              hint={`You must be ${MINIMUM_AGE} or over.`}
              error={shown("dateOfBirth")}
            >
              <input
                {...bind("dateOfBirth")}
                type="date"
                min="1900-01-01"
                max={latestAdultBirthDate()}
                autoComplete="bday"
              />
            </Field>
            <Field id={f("role")} label="Role" error={shown("role")}>
              <select {...bind("role")}>
                <option value="" disabled>
                  Choose one
                </option>
                {ROLES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid items-start gap-4 sm:grid-cols-2">
            <Field id={f("organization")} label="Organisation" error={shown("organization")}>
              <input {...bind("organization")} autoComplete="organization" maxLength={160} />
            </Field>
            <Field id={f("country")} label="Country" error={shown("country")}>
              <input {...bind("country")} autoComplete="country-name" maxLength={80} />
            </Field>
          </div>
          <Field
            id={f("intendedUse")}
            label="How will you use the API?"
            hint={`At least ${INTENDED_USE_MIN} characters. For example, the project, task types or data you plan to evaluate.`}
            error={shown("intendedUse")}
          >
            <textarea
              {...bind("intendedUse")}
              rows={3}
              maxLength={INTENDED_USE_MAX}
              className={`${inputClass} h-auto py-2.5`}
            />
            <p
              className={`mt-1 text-right text-xs tabular-nums ${
                useLength > 0 && useLength < INTENDED_USE_MIN
                  ? "text-warning"
                  : "text-muted-foreground"
              }`}
              aria-live="polite"
            >
              {useLength < INTENDED_USE_MIN
                ? `${useLength} / ${INTENDED_USE_MIN} characters minimum`
                : `${useLength} / ${INTENDED_USE_MAX}`}
            </p>
          </Field>
          <div className="grid items-start gap-4 sm:grid-cols-2">
            <Field
              id={f("password")}
              label="Password"
              hint="At least 10 characters."
              error={shown("password")}
            >
              <input
                {...bind("password")}
                type="password"
                maxLength={128}
                autoComplete="new-password"
              />
            </Field>
            <Field id={f("confirm")} label="Confirm password" error={shown("confirm")}>
              <input
                {...bind("confirm")}
                type="password"
                maxLength={128}
                autoComplete="new-password"
              />
            </Field>
          </div>
          <div>
            <label className="flex items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                name="acceptTerms"
                required
                aria-required
                checked={values.acceptTerms}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setValues((v) => ({ ...v, acceptTerms: checked }));
                  setTouched((t) => ({ ...t, acceptTerms: true }));
                }}
                className="mt-0.5"
              />
              <span>
                I confirm I am {MINIMUM_AGE} or over and accept the terms of use. I will not send
                identifiable patient information to the API.
              </span>
            </label>
          </div>
          {formError ? (
            <p role="alert" className="text-sm text-danger">
              {formError}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={!valid || busy}
            aria-describedby={valid ? undefined : `${id}-incomplete`}
            className={buttonClass(
              "primary",
              "w-full disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {busy ? "Creating account" : "Create account"}
          </button>
          {!valid ? (
            <div id={`${id}-incomplete`} className="text-xs" aria-live="polite">
              <p className="text-center text-muted-foreground">
                To create your account, fix the following:
              </p>
              <ul className="mx-auto mt-1.5 w-fit list-disc space-y-0.5 pl-5 text-warning">
                {missingSummary(errors, values).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="text-xs leading-relaxed text-muted-foreground">
            Your date of birth is used only to check the age requirement and is never shown back or
            shared. Evaluation data you send to the API is processed in memory and never stored.
          </p>
        </form>
      )}
    </AuthCard>
  );
}
