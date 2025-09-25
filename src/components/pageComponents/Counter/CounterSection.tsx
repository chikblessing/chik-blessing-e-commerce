import dynamic from 'next/dynamic';
import CounterItem from './CounterItem';


const CounterSection = () => {
    return (
        <div className="bg-[#F8F6F6] py-6">
      <div className="bg-[#084710] py-3">
        <div className="flex justify-center px-3 py-6 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl text-white">
            <CounterItem end={25000} label={`Happy Customers`} symbol="+" />
            <CounterItem end={120} label={`Brands We Stock`} symbol="+" />
            <CounterItem end={2000} label={`Retail Partners`} symbol="+" />
            <CounterItem end={98} label={`Customer Satisfaction`} symbol="%" />
          </div>
        </div>
      </div>
      </div>
    )
}
export default CounterSection;