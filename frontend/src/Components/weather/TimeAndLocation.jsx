
const TimeAndLocation = ({weather: {formattedLocalTime, name, country}}) => {
  return (
    <div className="">
        {/* <div className="flex items-center justify-center my-6">
            <p className="text-lg font-extralight">
                {formattedLocalTime}
            </p>
        </div> */}

        <div className="flex items-center justify-center my-2">
            <p className="text-3xl font-medium">{`${name}, ${country}`}</p>
        </div>
    </div>
  )
}

export default TimeAndLocation