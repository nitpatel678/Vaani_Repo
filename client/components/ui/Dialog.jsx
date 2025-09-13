import React, { useState } from "react";

const clsx = (...args) => {
  return args.flat().filter(Boolean).join(" ");
};

export function Dialog({ children, onOpenChange }) {
  const [open, setOpen] = useState(false);

  const handleSetOpen = (state) => {
    setOpen(state);
    onOpenChange?.(state);
  };

  return (
    <React.Fragment>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { open, setOpen: handleSetOpen })
      )}
    </React.Fragment>
  );
}

export function DialogTrigger({ children, setOpen, asChild }) {
  const trigger = React.cloneElement(children, {
    onClick: (e) => {
      children.props.onClick?.(e); // keep original handler
      setOpen(true);
    },
  });
  return asChild ? trigger : <button onClick={() => setOpen(true)}>{children}</button>;
}

export function DialogContent({ children, open, setOpen, className }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full max-w-lg relative p-6",
          className
        )}
      >
        {children}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}
