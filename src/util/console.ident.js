// Featured
const extractLineNumber = stack => /([^\/]+):/.exec(stack.split("\n")[2])[1];

export const logIdent = (v, opt = { label: "", lineNumber: false }) => {
  const label =
    typeof opt === "string"
      ? opt
      : `${opt.label}${opt.lineNumber ? extractLineNumber(Error().stack) : ""}`;

  console.log(
    `%c${label}`,
    "background:black;color:white;border-radius:5px;padding:1px",
    v
  );

  return v;
};

export const polyfill = () => (console.ident = logIdent);
