import { useTranslation } from "react-i18next";

export function PlaceholderPage({ title, icon }: { title: string; icon: string; }) {
  const { t } = useTranslation();
  return (
    <div style={{ padding: "2rem" }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "var(--color-primary)",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          background: "white",
          padding: "3rem",
          borderRadius: "16px",
          boxShadow: "var(--box-shadow-light)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{icon}</div>
        <p
          style={{ color: "var(--color-text-tertiary)", fontSize: "1.125rem" }}
        >
          {t("placeholder.underDevelopment")}
        </p>
      </div>
    </div>
  );
}
