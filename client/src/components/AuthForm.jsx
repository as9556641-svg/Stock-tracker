import { useState } from "react";

function PasswordField({ field, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="block" key={field.name}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</span>
      <div className="relative">
        <input
          className="input pr-16"
          name={field.name}
          onChange={onChange}
          placeholder={field.placeholder}
          required
          type={showPassword ? "text" : "password"}
          value={value}
        />
        <button
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-2 my-auto inline-flex h-10 items-center justify-center rounded-xl px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          onClick={() => setShowPassword((current) => !current)}
          type="button"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}

function AuthForm({
  fields,
  values,
  onChange,
  onSubmit,
  buttonText,
  loading,
  footer
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {fields.map((field) =>
        field.type === "password" ? (
          <PasswordField
            field={field}
            key={field.name}
            onChange={onChange}
            value={values[field.name]}
          />
        ) : (
          <label className="block" key={field.name}>
            <span className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</span>
            <input
              className="input"
              name={field.name}
              onChange={onChange}
              placeholder={field.placeholder}
              required
              type={field.type}
              value={values[field.name]}
            />
          </label>
        )
      )}

      <button className="btn-primary w-full" disabled={loading} type="submit">
        {loading ? "Please wait..." : buttonText}
      </button>

      {footer}
    </form>
  );
}

export default AuthForm;
