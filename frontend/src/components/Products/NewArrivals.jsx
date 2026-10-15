import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const NewArrivals = () => {

    const scrollRef = React.useRef(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);

    const newArrivals = [
        {
            _id:"1",
            name:"Stylish Jacket",
            price:120,
            images: [
                {
                    url:"https://picsum.photos/500/500/?random=1"
                }
            ]

        },
        {
            _id:"2",
            name:"Stylish Jacket",
            price:120,
            images: [
                {
                    url:"https://picsum.photos/500/500?random=2"
                }
            ]

        },
        {
            _id:"3",
            name:"Stylish Jacket",
            price:120,
            images: [
                {
                    url:"https://picsum.photos/500/500?random=3"
                }
            ]

        },
        {
            _id:"4",
            name:"Stylish Jacket",
            price:120,
            images: [
                {
                    url:"https://picsum.photos/500/500?random=4"
                }
            ]

        },
        {
            _id:"5",
            name:"Stylish Jacket",
            price:120,
            images: [
                {
                    url:"https://picsum.photos/500/500?random=5"
                }
            ]

        },
        {
            _id:"6",
            name:"Stylish Jacket",
            price:120,
            images: [
                {
                    url:"https://picsum.photos/500/500?random=6"
                }
            ]

        },
        {
            _id:"7",
            name:"Stylish Jacket",
            price:120,
            images: [
                {
                    url:"https://picsum.photos/500/500?random=7"
                }
            ]

        },
        {
            _id:"8",
            name:"Stylish Jacket",
            price:120,
            images: [
                {
                    url:"https://picsum.photos/500/500?random=8"
                }
            ]

        }, 
    ]
    
    const handleMouseDown = (e)=> {
        setIsDragging(true)
        setStartX(e.pageX- scrollRef.current.offsetLeft)
        setScrollLeft(scrollRef.current.scrollLeft)
    }
    const handleMouseMove = (e) => {
        if (!isDragging) return ;
        const x = e.pageX - scrollRef.current.offsetLeft
        const walk = x - startX
        scrollRef.current.scrollLeft = scrollLeft - walk
    }
    const handleMouseUpOrLeave = (e => {

    })

    const scroll = (direction) => {
        const scrollAmount = direction === 'left' ? -300 : 300;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    //update scroll buttons
    const updateScrollButtons = () => {
        const container = scrollRef.current;

        if (container){
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;
            
            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable);
        }
    }

    React.useEffect(() => {
        const container = scrollRef.current;
        if(container){
            container.addEventListener("scroll" , updateScrollButtons);
            updateScrollButtons();
            return () => container.removeEventListener("scroll", updateScrollButtons);
        }
    }, []);
  return (
    <section className='px-4 py-16 lg:px-0'>
        <div className='container relative mx-auto mb-10 text-center'>
            <h2 className='mb-4 text-3xl font-bold'>
                Explore New Arrivals
            </h2>
            <p className='mb-8 text-lg text-gray-600'>
                Discover the latest styles straight off the runway , freshly added to keep your wardrobe on the cutting edge of fashion
            </p>
            {/* Scroll Buttons */}
            <div className='absolute right-0 bottom-[-30px] flex space-x-2'>
                <button onClick={() => scroll("left")}
                 disabled={!canScrollLeft}   
                 className={`p-2 rounded border ${canScrollLeft ? ' bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                 }`}
                 >
                    <FiChevronLeft className='text-2xl'  />
                </button>
                <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight} 
                className={`p-2 rounded border ${canScrollRight ? ' bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                 }`}>
                    <FiChevronRight className='text-2xl'  />
                </button>
            </div> 
        </div>

        {/* Scrollable Content */}
        <div ref={scrollRef} 
        className='container relative flex mx-auto space-x-6 overflow-x-scroll'
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        >
            {newArrivals.map((product) => (
                <div key={product._id} className='min-w-[100%] sm:min-w-[30%] relative'>
                    <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className='w-full h-[500px] object-cover rounded-lg'
                    />
                    <div className='absolute bottom-0 left-0 right-0 p-4 text-white bg-opacity-50 rounded-b-lg backdrop-blur-md'>
                        <Link to={`/product/${product._id}`} className="block">
                            <h4 className='font-medium'>{product.name}</h4>
                            <p className='mt-1'>${product.price}</p>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </section>
  )
}

export default NewArrivals