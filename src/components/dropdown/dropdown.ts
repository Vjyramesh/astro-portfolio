'use strict';

import { mountComponent } from "../../libs/component-mount";

export class Dropdown {
    private abortController = new AbortController();
    private dropdownList: HTMLElement | null;
    private dropdownListItems: HTMLElement[];
    private button: HTMLButtonElement | null;

    constructor(private block: HTMLElement) {
        this.button = this.block.querySelector<HTMLButtonElement>('button');
        this.dropdownList = this.block.querySelector<HTMLElement>('.cmp-dropdown__list');
        this.dropdownListItems = Array.from(this.dropdownList?.querySelectorAll('.cmp-dropdown__list-item') || []);
        this.button?.addEventListener('click', this.toggle, {
            signal: this.abortController.signal,
        });

        document.addEventListener('click', this.handleOutsideClick, {
            signal: this.abortController.signal,
        });

        this.dropdownListItems.forEach((item, index) => {
            item.addEventListener('click', this.handleItemSelect, {
                signal: this.abortController.signal,
            });

            item.addEventListener('keydown', (e) => this.handleItemKeydown(e, index), {
                signal: this.abortController.signal,
            });
        });
    }

    private open = () => {
        if (!this.button || !this.dropdownList) return;
        this.dropdownList.removeAttribute('hidden');
        this.button.setAttribute('aria-expanded', 'true');
    };

    private close = () => {
        if (!this.button || !this.dropdownList) return;
        this.dropdownList.setAttribute('hidden', '');
        this.button.setAttribute('aria-expanded', 'false');
    };

    private toggle = (event: Event) => {
        event.stopPropagation();
        if (!this.dropdownList) return;

        const isHidden = this.dropdownList.hasAttribute('hidden');
        if (isHidden) this.open();
        else this.close();
    };

    private handleOutsideClick = (event: Event) => {
        if (!this.block.contains(event.target as Node)) {
            this.close();
        }
    };

    private handleItemSelect = () => {
        this.close();
    }

    private handleItemKeydown = (e: KeyboardEvent, index: number) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                this.dropdownListItems[index + 1]?.focus();
                break;

            case "ArrowUp":
                e.preventDefault();
                this.dropdownListItems[index - 1]?.focus();
                break;

            case "Home":
                e.preventDefault();
                this.dropdownListItems[0]?.focus();
                break;

            case "End":
                e.preventDefault();
                this.dropdownListItems[this.dropdownListItems.length - 1]?.focus();
                break;

            case "Escape":
                e.preventDefault();
                this.close();
                break;

            case "Enter":
            case " ":
                e.preventDefault();
                this.handleItemSelect();
                break;
        }
    }

    destroy() {
        this.abortController.abort();
    }
}

mountComponent(".cmp-dropdown", (block) => new Dropdown(block));