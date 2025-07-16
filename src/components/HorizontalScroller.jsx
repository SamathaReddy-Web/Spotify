const HorizontalScroller = ({ title, data = [] }) => {
  return (
    <div className="mb-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button className="text-sm text-green-400 hover:underline">Show all</button>
      </div>
      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex space-x-4">
          {(data || []).map((item) => (
            <div
              key={item.id}
              className="w-40 shrink-0 bg-zinc-900 rounded-lg p-2 cursor-pointer hover:bg-zinc-800 transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <p className="text-sm font-semibold truncate">{item.name}</p>
              <p className="text-xs text-gray-400 truncate">{item.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScroller