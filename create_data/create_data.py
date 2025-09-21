import os
import shutil
import random
from PIL import Image
import numpy as np

def create_data_folders(base_path):
    data_path = os.path.join(base_path, 'data')
    for split in ['train', 'validation', 'test']:
        for cls in ['cat', 'dog']:
            os.makedirs(os.path.join(data_path, split, cls), exist_ok=True)
    return data_path

def split_data(image_list, split_ratio):
    random.shuffle(image_list)
    n = len(image_list)
    train_end = int(n * split_ratio[0])
    val_end = train_end + int(n * split_ratio[1])
    return image_list[:train_end], image_list[train_end:val_end], image_list[val_end:]

def augment_image(img):
    augmented = []
    # 1 ảnh xoay ngẫu nhiên
    angle = random.choice([90, 180, 270])
    rotated = img.rotate(angle)
    if rotated.mode != 'RGB':
        rotated = rotated.convert('RGB')
    augmented.append(rotated)
    # 1 ảnh nhiễu Gaussian
    arr = np.array(img)
    # Độ nhiễu dao động từ 0 - 10
    noise = np.random.normal(0, 10, arr.shape).astype(np.uint8)
    noisy_img = Image.fromarray(np.clip(arr + noise, 0, 255).astype(np.uint8))
    if noisy_img.mode != 'RGB':
        noisy_img = noisy_img.convert('RGB')
    augmented.append(noisy_img)
    return augmented

def process_images(base_path):
    pet_path = os.path.join(base_path, 'pet_images')
    data_path = create_data_folders(base_path)
    split_ratio = [0.7, 0.2, 0.1]
    for cls in ['cat', 'dog']:
        img_dir = os.path.join(pet_path, cls)
        images = [f for f in os.listdir(img_dir) if f.lower().endswith('.jpg')]
        train, val, test = split_data(images, split_ratio)
        # Copy validation và test
        for split, split_imgs in zip(['validation', 'test'], [val, test]):
            for img_name in split_imgs:
                src = os.path.join(img_dir, img_name)
                dst = os.path.join(data_path, split, cls, img_name)
                shutil.copy2(src, dst)
        # Augment và copy train
        for img_name in train:
            src = os.path.join(img_dir, img_name)
            dst = os.path.join(data_path, 'train', cls, img_name)
            shutil.copy2(src, dst)
            try:
                img = Image.open(src)
                img.verify()  # Kiểm tra lỗi ảnh
                img = Image.open(src)  # Mở lại để augment
            except Exception as e:
                print(f"Lỗi ảnh: {src} - {e}")
                continue
            aug_imgs = augment_image(img)
            for i, aug_img in enumerate(aug_imgs):
                aug_name = f"{os.path.splitext(img_name)[0]}_aug{i+1}.jpg"
                aug_dst = os.path.join(data_path, 'train', cls, aug_name)
                aug_img.save(aug_dst)

if __name__ == "__main__":
    base_path = os.path.dirname(os.path.abspath(__file__))
    process_images(base_path)
    print("Data folder created and images processed.")
