type QueryStateProps = {
  title: string;
  description: string;
};

export function QueryState({ title, description }: QueryStateProps) {
  return (
    <div className="glass-panel rounded-[1.8rem] p-6">
      <p className="text-xs uppercase tracking-[0.26em] text-bapi-jade">{title}</p>
      <p className="mt-3 text-sm leading-6 text-bapi-evergreen/68">
        {description}
      </p>
    </div>
  );
}
