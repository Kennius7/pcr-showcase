
const EditableText = ({ value, onChange, className = "", multiline = false, placeholder = "", toggleEdit }: {
    value: string | undefined;
    onChange: (value: string) => void;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
    toggleEdit: boolean;
}) => {
    if (toggleEdit) {
        return multiline ? (
            <textarea
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className={`border border-gray-300 rounded px-2 py-1 w-full resize-none ${className}`}
                placeholder={placeholder}
                rows={3}
            />
        ) : (
            <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className={`border border-gray-300 rounded px-2 py-1 w-full ${className}`}
                placeholder={placeholder}
            />
        );
    }
    return <span className={className}>{value}</span>;
};


export default EditableText;
