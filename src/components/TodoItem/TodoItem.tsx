/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  toggleTodo: (todoId: number, completed: boolean) => void;
  deleteTodo: (todoId: number) => void;
  isLoading: boolean;
  renameTodo: (todoId: number, newTitle: string) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodo,
  deleteTodo,
  isLoading,
  renameTodo,
}) => {
  const { id, title, completed } = todo;
  const checkboxName = `checkbox-${id}`;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const finishEditing = () => {
    const trimmed = editedTitle.trim();

    if (!trimmed) {
      deleteTodo(id);

      return;
    }

    if (trimmed === title) {
      setIsEditing(false);

      return;
    }

    renameTodo(id, trimmed).finally(() => {
      setIsEditing(false);
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }

    if (event.key === 'Enter') {
      finishEditing();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    finishEditing();
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label" htmlFor={checkboxName}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          id={checkboxName}
          name={checkboxName}
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo(id, !completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
