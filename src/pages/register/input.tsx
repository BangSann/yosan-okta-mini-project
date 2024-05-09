const Input = ({
  childern,
  type,
  register,
  error,
}: {
  childern: string;
  type: string;
  register: any;
  error: any;
}) => {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text text-xl">{childern}</span>
      </div>
      <input
        {...register}
        type={type}
        placeholder="Type here"
        className={`input input-bordered w-full rounded-3xl py-8 border-2 text-lg ${
          error ? "border-red-600" : ""
        }`}
      />
      {error ? (
        <div className="label">
          <span className="label-text-alt text-red-600 px-2 text-sm">
            {error}
          </span>
        </div>
      ) : (
        ""
      )}
    </label>
  );
};

export default Input;
