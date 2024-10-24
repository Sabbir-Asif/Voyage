import { div } from "framer-motion/client";

const Forecast = ({title, data}) => {

    console.log(data.icon);
  return (
    <div>
        <div className="flex items-center justify-start mt-6">
            <p className="font-medium uppercase">{title}</p>
        </div>
        <hr className="my-1" />

        <div className="flex items-center justify-between">
            {
                data.map((data, index) => (
                    <div
                    key={index}
                    className="flex flex-col items-center justify-center"
                    >
                        <p className="font-light text-sm">{data.title}</p>
                        <p className="font-medium">{`${data.temp.toFixed()}°`}</p>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Forecast