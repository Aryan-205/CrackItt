"use client";

import {
  Check,
  ListTodo,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "crackitt-todo-lists";

type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

type TodoList = {
  id: string;
  title: string;
  items: TodoItem[];
  createdAt: number;
};

type Filter = "all" | "active" | "completed";

function createId() {
  return crypto.randomUUID();
}

function loadLists(): TodoList[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TodoList[]) : [];
  } catch {
    return [];
  }
}

function saveLists(lists: TodoList[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

function createList(title = "My checklist"): TodoList {
  return {
    id: createId(),
    title,
    items: [],
    createdAt: Date.now(),
  };
}

export function TodoListSection() {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<Record<string, Filter>>({});
  const [addingToListId, setAddingToListId] = useState<string | null>(null);

  useEffect(() => {
    setLists(loadLists());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveLists(lists);
  }, [lists, hydrated]);

  const updateLists = (updater: (prev: TodoList[]) => TodoList[]) => {
    setLists(updater);
  };

  const handleCreateList = () => {
    const list = createList();
    updateLists((prev) => [list, ...prev]);
    setEditingTitleId(list.id);
    setTitleDraft(list.title);
  };

  const handleSaveTitle = (listId: string) => {
    const title = titleDraft.trim() || "My checklist";
    updateLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, title } : list)),
    );
    setEditingTitleId(null);
    setTitleDraft("");
  };

  const handleAddItem = (listId: string) => {
    const text = (newItemText[listId] ?? "").trim();
    if (!text) return;

    const item: TodoItem = {
      id: createId(),
      text,
      completed: false,
      createdAt: Date.now(),
    };

    updateLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, items: [...list.items, item] } : list,
      ),
    );
    setNewItemText((prev) => ({ ...prev, [listId]: "" }));
    setAddingToListId(null);
  };

  const handleToggleItem = (listId: string, itemId: string) => {
    updateLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item,
              ),
            }
          : list,
      ),
    );
  };

  const handleDeleteItem = (listId: string, itemId: string) => {
    updateLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list,
      ),
    );
  };

  const handleClearCompleted = (listId: string) => {
    updateLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => !item.completed) }
          : list,
      ),
    );
  };

  const getFilter = (listId: string): Filter => filters[listId] ?? "all";

  const setFilter = (listId: string, filter: Filter) => {
    setFilters((prev) => ({ ...prev, [listId]: filter }));
  };

  const getVisibleItems = (list: TodoList) => {
    const filter = getFilter(list.id);
    if (filter === "active") return list.items.filter((item) => !item.completed);
    if (filter === "completed") {
      return list.items.filter((item) => item.completed);
    }
    return list.items;
  };

  const listSummaries = useMemo(
    () =>
      lists.map((list) => {
        const completed = list.items.filter((item) => item.completed).length;
        const total = list.items.length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { list, completed, total, percent };
      }),
    [lists],
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Personalize your checklists</CardTitle>
          <CardDescription>
            Tailor your preparation roadmap according to your needs.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleCreateList}>
          <Plus className="h-4 w-4" />
          Make a TODO list
        </Button>
      </CardHeader>

      {lists.length > 0 && (
        <CardContent className="flex flex-col gap-4">
          {listSummaries.map(({ list, completed, total, percent }) => {
            const visibleItems = getVisibleItems(list);
            const filter = getFilter(list.id);
            const hasCompleted = list.items.some((item) => item.completed);

            return (
              <Card key={list.id} size="sm">
                <CardHeader className="gap-3 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <ListTodo className="h-4 w-4 text-primary" />
                      </div>
                      {editingTitleId === list.id ? (
                        <form
                          className="flex min-w-0 flex-1 items-center gap-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveTitle(list.id);
                          }}
                        >
                          <Input
                            value={titleDraft}
                            onChange={(e) => setTitleDraft(e.target.value)}
                            placeholder="List name"
                            autoFocus
                            className="h-8"
                          />
                          <Button type="submit" size="icon-sm">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setEditingTitleId(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </form>
                      ) : (
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <CardTitle className="truncate text-base">
                            {list.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => {
                              setEditingTitleId(list.id);
                              setTitleDraft(list.title);
                            }}
                            aria-label={`Rename ${list.title}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {completed}/{total} done
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          setAddingToListId((id) =>
                            id === list.id ? null : list.id,
                          )
                        }
                        aria-label={`Add task to ${list.title}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={percent} />
                </CardHeader>

                <Separator />

                <CardContent className="flex flex-col gap-3 pt-4">
                  {addingToListId === list.id && (
                    <form
                      className="flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddItem(list.id);
                      }}
                    >
                      <Input
                        value={newItemText[list.id] ?? ""}
                        onChange={(e) =>
                          setNewItemText((prev) => ({
                            ...prev,
                            [list.id]: e.target.value,
                          }))
                        }
                        placeholder="Add a task..."
                        autoFocus
                      />
                      <Button type="submit" size="sm">
                        Add
                      </Button>
                    </form>
                  )}

                  {list.items.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {(["all", "active", "completed"] as const).map(
                        (option) => (
                          <Button
                            key={option}
                            variant={filter === option ? "secondary" : "ghost"}
                            size="xs"
                            onClick={() => setFilter(list.id, option)}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Button>
                        ),
                      )}
                      {hasCompleted && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleClearCompleted(list.id)}
                        >
                          Clear completed
                        </Button>
                      )}
                    </div>
                  )}

                  {visibleItems.length > 0 ? (
                    <ul className="flex flex-col gap-1">
                      {visibleItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center gap-2 rounded-lg px-1 py-1.5 hover:bg-muted/50"
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleItem(list.id, item.id)}
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                              item.completed
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-input bg-background hover:border-primary",
                            )}
                            aria-label={
                              item.completed
                                ? `Mark "${item.text}" incomplete`
                                : `Mark "${item.text}" complete`
                            }
                          >
                            {item.completed && (
                              <Check className="h-3 w-3" strokeWidth={3} />
                            )}
                          </button>
                          <span
                            className={cn(
                              "flex-1 text-sm",
                              item.completed &&
                                "text-muted-foreground line-through",
                            )}
                          >
                            {item.text}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteItem(list.id, item.id)}
                            aria-label={`Delete "${item.text}"`}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {list.items.length === 0
                        ? "No tasks yet. Click + to add your first one."
                        : `No ${filter} tasks.`}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}
