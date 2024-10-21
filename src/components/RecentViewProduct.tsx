import React from 'react'

export const RecentViewProduct = ({ data }: { data: any[] }) => {
 
  return (
    <div className="mt-5">
    <div className="pb-4">
      <h2 className="text-lg font-semibold">Recent view</h2>
    </div>
    <div className="grid grid-cols-12 gap-3 ">
      {data.map((data) => {
        return (
          <div className="col-span-4" key={data.id}>
            <img src={data.images[0]} alt={data.title} />
          </div>
        );
      })}
    </div>
  </div>
  )
}
