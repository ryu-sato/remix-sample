import { useControlField, useField } from "remix-validated-form";

type Option = {
  value: number | string,
  label: string,
}

type FormInputProps = {
  name: string;
  label: string;
  options: Array<Option>;
  nullable?: boolean;
};

export const FormSelect = ({ name, label, options, nullable = true }: FormInputProps) => {
  const { error } = useField(name);
  const [value] = useControlField<number>(name);

  return (
    <div>
      <label htmlFor={ name } className="form-label">{ label }</label>
      <select name={ name } className="form-control" defaultValue={ value }>
        { nullable &&
          <option value=""></option>
        }
        { options.map(o => (
          <option key={ o.value.toString() } value={ o.value }>{ o.label }</option>
        ))}
      </select>
      { error && (
        <span style={{ color: "red" }}>{ error }</span>
      )}
    </div>
  );
};
