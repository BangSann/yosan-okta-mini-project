const Input = ({childern , type} : {childern:string ,type : string}) => {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text text-xl">{childern}</span>
      </div>
      <input
        type={type}
        placeholder="Type here"
        className="input input-bordered w-full rounded-3xl py-8 border-2 text-lg"
      />
      <div className="label hidden">
        <span className="label-text-alt">Bottom Left label</span>
      </div>
    </label>
  );
};

export default Input;
