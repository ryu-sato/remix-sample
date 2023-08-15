import { useField } from "remix-validated-form";

type FormTextAreaProps = {
  name: string;
  label: string;
};

export const FormTextArea = ({ name, label }: FormTextAreaProps) => {
  const { error, getInputProps } = useField(name);

  return (
    <div>
      <label htmlFor={ name }>{ label }</label>
      <textarea {...getInputProps({ id: name })} />
      { error && (
        <span style={{ color: "red" }}>{ error }</span>
      )}
    </div>
  );
};
