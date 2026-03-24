// src/scripts/mountComponent.ts

type Instance = {
  destroy?: () => void;
};

export function mountComponent(
  selector: string,
  callback: (root: HTMLElement) => Instance | void
) {
  let instances: Instance[] = [];

  const init = () => {
    // cleanup old instances
    instances.forEach((i) => i.destroy?.());
    instances = [];

    // mount new ones
    document.querySelectorAll<HTMLElement>(selector).forEach((root) => {
      const instance = callback(root);
      if (instance) instances.push(instance);
    });
  };

  init();


  return () => {
    instances.forEach((i) => i.destroy?.());
    instances = [];
  };
}