const createCounter = () => {
    let count = 0;

    return {
        getCount: () => count,
        setCount: (newCount) => count = newCount
    };
};

export const counter = createCounter();
