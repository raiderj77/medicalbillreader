export default function Disclaimer() {
  return (
    <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl">
      <p className="text-amber-900 dark:text-amber-300 font-semibold text-base mb-2">
        Important Disclaimer
      </p>
      <p className="text-amber-800 dark:text-amber-400 text-sm leading-relaxed">
        This tool provides general explanations of medical billing codes and charges for
        informational purposes only. It does not constitute financial or medical advice.
        Always verify charges directly with your healthcare provider and insurance company
        before taking action.
      </p>
    </div>
  );
}
