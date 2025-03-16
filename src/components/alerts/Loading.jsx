const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm">
      <span className="text-lg text-emerald-600 font-medium animate-pulse">
        Loading
        <span className="animate-[dots_1.5s_steps(3,end)_infinite]">...</span>
      </span>

      <style>
        {`
          @keyframes dots {
            0% { content: ""; }
            33% { content: "."; }
            66% { content: ".."; }
            100% { content: "..."; }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;
