import os
from PIL import Image

def check_images_in_folder(folder_path, exts=(".jpg", ".jpeg", ".png")):
    error_files = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(exts):
                file_path = os.path.join(root, file)
                try:
                    with Image.open(file_path) as img:
                        img.verify()  # Check if image can be opened
                except Exception as e:
                    error_files.append((file_path, str(e)))
    return error_files

if __name__ == "__main__":
    data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
    errors = check_images_in_folder(data_dir)
    if errors:
        print(f"Found {len(errors)} corrupted or unreadable images:")
        for path, err in errors:
            print(f"{path}: {err}")
    else:
        print("All images in data folder are valid.")
