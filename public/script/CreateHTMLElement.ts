export default class HTMLElement {
    tagName;
    attributes: any;
    children: any[];

    constructor(tagName: string) {
        this.tagName = tagName;
        this.attributes = {};
        this.children = [];
    }

    setAttribute(name: string, value: string) {
        this.attributes[name] = value;
    }

    appendChild(child: any) {
        this.children.push(child);
    }

    render() {
        // Generate the HTML markup for the element and its children
        const element = document.createElement(this.tagName);

        // Set attributes
        for (const [name, value] of Object.entries(this.attributes)) {
            element.setAttribute(name, (value as string));
        }

        // Append children
        for (const child of this.children) {
            if (child instanceof HTMLElement) {
                element.appendChild(child.render());
            } else {
                element.appendChild(document.createTextNode(child));
            }
        }

        return element;
    }
}