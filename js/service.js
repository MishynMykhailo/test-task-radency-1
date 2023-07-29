import { data } from "./data.js";

const store = {
  data,
};

export const createTodo = (formstore) => {
  const [year, month, day] = formstore.date.split("-");
  const newTodo = {
    id: Date.now().toString(),
    name: formstore.name,
    created: new Date().toLocaleString(),
    category: formstore.category,
    content: formstore.content,
    date: formstore.date ? [`${day}/${month}/${year}`] : "",
    archive: false,
  };
  store.data = [...store.data, newTodo];
};

export const editTodo = (formData, id) => {
  const todo = store.data.find((item) => item.id === id);
  const [year, month, day] = formData.date.split("-");
  todo.name = formData.name;
  todo.category = formData.category;
  todo.content = formData.content;
  todo.date = [...todo.date, `${day}/${month}/${year}`];
};

export const deleteTodo = (id) => {
  store.data = store.data.filter((todo) => todo.id !== id);
};

export const changeStatusTodo = (id) => {
  const todo = store.data.find((todo) => todo.id === id);
  todo.archive = !todo.archive;
};

export const getMainList = () => store.data.filter((item) => !item.archive);

export const getArchiveList = () => store.data.filter((item) => item.archive);

export const getStatistics = () =>
  store.data.reduce((acc, todo) => {
    const category = acc.find((cat) => cat.name === todo.category);

    if (!category) {
      return [
        ...acc,
        {
          name: todo.category,
          active: todo.archive ? 0 : 1,
          archive: todo.archive ? 1 : 0,
        },
      ];
    }

    todo.archive ? category.archive++ : category.active++;
    return acc;
  }, []);
