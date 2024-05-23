function Skeleton() {
    return(
        <div className={`page h-[20rem] min-h-[25rem] w-[65rem] border-2 border-[#5f5c5c] bg-[#1f1d1d] shadow-btnShadow flex relative`}>
                  {/*------------------- Black Car DIV ------------------- */}
                  <div className='w-1/2 h-full flex justify-center items-center'>
                  </div>
                <div className='w-1/2 h-full flex flex-col space-y-3 py-2'>
                {/*Show specs */} 
                <div className="flex justify-between items-center">
                  <button
                    className="absolute top-0 right-0 bg-[#383c3d] h-[2.5rem] w-[3.5rem] rounded-bl-md focus:outline-none"
                  >
                  </button>
                    <div className="ml-2 mt-1 bg-[#333742] rounded-xl h-full my-auto w-3/4 flex flex-col shadow-btnShadow border-2 border-[#9ebed1]">
                                  <div className='flex space-x-8 mx-auto my-auto'>

                                      <div className='flex flex-col h-full my-auto text-center'>
                                          <div className='text-[#ffffff] text-[0.9rem] font-thin mx-2'> </div>
                                          <div className='text-[#eb784b] rounded-full mb-2 mt-2 mx-2 h-[3rem] w-[15rem] items-center bg-slate-600'><span className="text-[1.25rem] font-bold"></span><span className="text-[1.15rem] font-semibold"></span></div>
                                      </div>
                                  </div>
                              </div>
                      </div>
                      <div className="mx-2 bg-[#333742] rounded-xl h-full w-4/4 flex shadow-btnShadow border-2 border-[#a6bac5]">
                            <div className='flex flex-col w-1/2 border-[#d8dee2] border-r space-y-3 space-x-2 items-start justify-center text-[#ffffff] font-semibold'>
                                <div className="mx-2 bg-slate-600 h-[1.3rem] w-[10rem] rounded-md">
                                </div>
                                <div className='bg-slate-600 h-[1.3rem] w-[10rem]  rounded-md'>
                                </div>
                                <div className='bg-slate-600 h-[1.3rem] w-[10rem]  rounded-md'>
                                </div>
                                <div className='bg-slate-600 h-[1.3rem] w-[10rem]  rounded-md'>
                                </div>
                                <div className='bg-slate-600 h-[1.3rem] w-[10rem]  rounded-md'>
                                </div>
                                <div className='bg-slate-600 h-[1.3rem] w-[10rem]  rounded-md'>
                                </div>
                                <div className='bg-slate-600 h-[1.3rem] w-[10rem]  rounded-md'>
                                </div>
                            </div>
                            <div className='flex flex-col w-1/2'>
                                <div className="flex flex-col h-3/4">
                                  <div className="invisible">
                                      sim
                                  </div>
                                  <div className="text-[#ffffff] font-normal space-y-4 text-center mt-2">
                                    <div className='bg-slate-600 h-[1.6rem] w-[9rem] mx-auto rounded-xl'>
                                    </div>
                                    <div className='bg-slate-600 h-[1.6rem] w-[9rem] mx-auto rounded-xl'>
                                    </div>
                                    <div className='bg-slate-600 h-[1.6rem] w-[9rem] mx-auto rounded-xl'>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                <div className="invisible">
                                    sim
                                </div>
                                <div className="text-[#ffffff] font-normal text-center border-[#c7cdda] border-t-2">
                                    <div className='bg-slate-600 h-[1.5rem] w-[10rem] mx-auto mt-3 mb-3 rounded-xl'>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col h-1/4 border-t-2 py-2 border-[#c7cdda] items-center justify-center">
                                  <div className='bg-slate-600 h-[1.8rem] w-[9rem] mx-auto mt-3 mb-3 rounded-md'></div>
                                  </div>
                            </div>
                      </div>
                  </div>
          </div>
    )
}

export default Skeleton