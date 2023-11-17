import { FormEvent} from 'react';
import Tree from 'react-d3-tree';

function Home() {
    const analyzeQuery = (ev: FormEvent<HTMLFormElement> ) => {
        ev.preventDefault();
        const form = ev.currentTarget;
        const username = form.username.value;
        const password = form.password.value;
        // insert into database 
    }

    const orgChart = {
        name: 'Parent',
        attributes: {
           Starting: '',
          },
        children: [
          {
            name: '27637',
            attributes: {
              included: '',
            },
            children: [
              {
                name: '37757',
                attributes: {
                  included: '',
                },
                children: [
                  {
                            name: '46568',
                            attributes: {
                              included: '',
                            },
                            children: [
                                {
                                    name: '56561',
                                    attributes: {
                                      included: '',
                                    },
                                    children: [
                                        {
                                            name:"56562",
                                            attributes: {
                                              included: '',
                                            },
                                            children: [
                                              {
                                                name: '56492',
                                                attributes: {
                                                  excluded: '',
                                                },

                                              },
                                              {
                                                name: '42801',
                                                attributes: {
                                                  excluded: '',
                                                },
                                                children: [
                                                  {
                                                    name: '42796',
                                                    attributes: {
                                                      excluded: '',
                                                    },
                                                    children: [
                                                      {
                                                        name: '42780',
                                                        attributes: {
                                                          excluded: '',
                                                        }, children: [
                                                              {
                                                                name: '29691',
                                                                attributes: {
                                                                  excluded: '',
                                                                },
                                                              },
                                                              {
                                                                name: '29694',
                                                                attributes: {
                                                                  excluded: '',
                                                                },
                                                              },
                                                              {
                                                                name: '56563',
                                                                attributes: {
                                                                  excluded: '',
                                                                },
                                                              },
                                                              {
                                                                name: '56564',
                                                                attributes: {
                                                                  excluded: '',
                                                                },
                                                              },
                                                        ],
                                                      },
                                                      {
                                                        name: '41247',
                                                        attributes: {
                                                          excluded: '',
                                                        }, children: [
                                                          {
                                                            name: '29691',
                                                            attributes: {
                                                              excluded: '',
                                                            },
                                                          },
                                                          {
                                                            name: '29694',
                                                            attributes: {
                                                              excluded: '',
                                                            },
                                                          },
                                                          {
                                                            name: '56563',
                                                           attributes: {
                                                            excluded: '',
                                                          },
                                                          },
                                                          {
                                                            name: '56564',
                                                            attributes: {
                                                              excluded: '',
                                                            },
                                                          },
                                                    ],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ]
                                        }, 
                                    ]
                                }
                            ]
                        }
                    ]
              },
            ],
          },
        ]
      };
    return(
        <div className='flex flex-col items-center space-y-2'>
            <div className='mt-4 mb-12 text-center bg-slate-400- font-serif'>Insert your relation query</div>
            <form onSubmit={() => {console.log("ok")}} className="text-center mb-10 h-[2rem] w-[14rem] rounded-md" >
                <input type="text" className="border-2 border-[#2e3875] text-center w-[12vw] min-w-[12rem] h-[3.5rem] rounded-full focus:outline-none" name="company" placeholder="" />
                <input type="submit" className='bg-slate-800 w-[6vw] min-w-[6rem] p-1 border-2 border-[#8f93a8] rounded-md text-center font-semibold text-[#ffffff] mt-2 hover:bg-[#8ca3c5] hover:text-black hover:border-[#153d5e] hover:italic shadow-btnShadow' value="Search"/>
            </form>
            <div className="border-2 border-slate-500 mt-10" id="treeWrapper" style={{margin: '5rem', width: '80vw', height: '60vh' }}>
                <Tree data={orgChart} />
            </div>
        </div>
    )
}
export default Home;