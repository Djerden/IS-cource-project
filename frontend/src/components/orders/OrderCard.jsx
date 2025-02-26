export default function OrderCard({ order }) {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{order.title}</h3>
                <p className="text-gray-700 mb-4">{order.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{order.price} ₽</span>
                    <button className="bg-[#8EE4AF] text-white px-4 py-2 rounded hover:bg-[#6dbb86]">
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    );
}